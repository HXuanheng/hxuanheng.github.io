#!/usr/bin/env python3
"""Aggregate the M&A goodwill-impairment event study into small cached series.

Reproduces ``plot_fund_event_study()`` from the paper repo
(``Synergies_Atif_Roberto/code/analyses.py``) for the two NUMERIC panels of the
paper's Figure 3:
  Panel (b): goodwill-impairment LIKELIHOOD (%)            -> gw_imp_ind
  Panel (d): goodwill-impairment INTENSITY (% of assets)   -> gw_imp_at
Both compare High Numeric vs No Disclosure by event year t in [-3, +3] around
the deal completion (effective) date.

Reads (from the Dropbox project, not committed):
  data/generated/funda_outcomes_dateeff.csv   master_deal_no, event_year, gw_imp_ind, gw_imp_at
  data/generated/master_wins.csv              scaled_estimate, text_dummy, numeric_dummy

Writes small caches into ./data (committed, so make_figures.py rebuilds anywhere):
  data/synergies_gwimp_likelihood.csv   event_year, group, mean, ci_lower, ci_upper
  data/synergies_gwimp_intensity.csv    event_year, group, mean, ci_lower, ci_upper

Groups (paper's exact conditions):
  "High numeric guidance" = scaled_estimate > positive-median(scaled_estimate)
  "No guidance"           = text_dummy == 0 & numeric_dummy == 0

Run once where Dropbox is available:  python prep_synergies_data.py
"""

import os
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
SRC = r"C:\Users\XuanH\Dropbox\Synergies_Atif_Roberto\data\generated"
FUNDA = os.path.join(SRC, "funda_outcomes_dateeff.csv")
MASTER = os.path.join(SRC, "master_wins.csv")

NUM = "High numeric guidance"
NONE = "No guidance"


def winsorize_by_group(df, value_col, group_col, limit=0.01):
    """Two-sided winsorize value_col within each group (matches the paper)."""
    def _w(s):
        lo, hi = s.quantile(limit), s.quantile(1 - limit)
        return s.clip(lo, hi)
    return df.groupby(group_col)[value_col].transform(_w)


def aggregate(df, value_col):
    stats = (df.groupby(["event_year", "group"])[value_col]
             .agg(["mean", "std", "count"]).reset_index())
    se = stats["std"] / np.sqrt(stats["count"].replace(0, np.nan))
    stats["ci_lower"] = stats["mean"] - 1.96 * se
    stats["ci_upper"] = stats["mean"] + 1.96 * se
    return stats[["event_year", "group", "mean", "ci_lower", "ci_upper"]]


def main():
    funda = pd.read_csv(FUNDA, usecols=["master_deal_no", "event_year",
                                        "gw_imp_ind", "gw_imp_at"])
    master = pd.read_csv(MASTER, usecols=["master_deal_no", "scaled_estimate",
                                          "text_dummy", "numeric_dummy"],
                         low_memory=False)
    df = funda.merge(master, on="master_deal_no", how="inner")

    # groups
    med = float(df.loc[df["scaled_estimate"] > 0, "scaled_estimate"].median())
    df["group"] = np.where(
        df["scaled_estimate"] > med, NUM,
        np.where((df["text_dummy"] == 0) & (df["numeric_dummy"] == 0), NONE, "Other"))
    df = df[df["group"] != "Other"].copy()
    print(f"positive median scaled_estimate = {med:.4f}")

    # baseline (event_year == -1): impute missing outcomes to 0
    base = df["event_year"] == -1
    for col in ("gw_imp_ind", "gw_imp_at"):
        df.loc[base & df[col].isna(), col] = 0.0

    # winsorize the continuous intensity by event_year (likelihood is binary -> leave)
    df["gw_imp_at"] = winsorize_by_group(df, "gw_imp_at", "event_year", 0.01)

    # event-year normalization then restrict to [-3, +3]
    df.loc[df["event_year"] < 0, "event_year"] = df.loc[df["event_year"] < 0,
                                                        "event_year"] + 1
    df = df[(df["event_year"] >= -3) & (df["event_year"] <= 3)].copy()

    df["likelihood"] = df["gw_imp_ind"] * 100.0          # panel b, %
    # panel d (gw_imp_at) already in % of assets

    lik = aggregate(df.dropna(subset=["likelihood"]), "likelihood")
    inten = aggregate(df.dropna(subset=["gw_imp_at"]), "gw_imp_at")
    lik.to_csv(os.path.join(DATA, "synergies_gwimp_likelihood.csv"), index=False)
    inten.to_csv(os.path.join(DATA, "synergies_gwimp_intensity.csv"), index=False)

    print("\nimpairment LIKELIHOOD (%) by event year:")
    print(lik.pivot(index="event_year", columns="group", values="mean").round(2).to_string())
    print("\nimpairment INTENSITY (% assets) by event year:")
    print(inten.pivot(index="event_year", columns="group", values="mean").round(3).to_string())


if __name__ == "__main__":
    main()
