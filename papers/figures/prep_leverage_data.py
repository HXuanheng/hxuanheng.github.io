#!/usr/bin/env python3
"""Compute Gross & Net squared-Sharpe (SR^2) levels per model for the leverage figure.

Reproduces the paper's srsquared.png content (Gross SR^2 and Net SR^2 for FF5, FF6, HXZ,
FundModel5, FundModel6). The FundModel *gross* factor returns are not in the repo (they
lived in a missing data/models_old/), so absolute levels can't be recomputed directly.
Instead we ANCHOR on FF5 -- computed with the paper's own bias-corrected _sr2 -- and add the
paper's EXACT published differences vs FF5 (gross: srdiff.tex; net: srdiff_tc.tex).

So the cross-model differences are exact; only the shared FF5 baseline is computed
(approximate by ~0.02). No per-bar numeric labels are drawn on the figure.

Reads (from the Dropbox project, not committed):
  leverage/data/models/F-F_Research_Data_5_Factors_2x3.csv   FF5 monthly factors
  leverage/data/models_tcosts/ff_tc.csv                      FF5 leg trading costs

Writes committed cache:
  data/leverage_srsquared.csv   model, gross_sr2, net_sr2

Run once where Dropbox is available:  python prep_leverage_data.py
"""

import os
import numpy as np
import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")
LEV = r"C:\Users\XuanH\Dropbox\leverage"
FF5_CSV = os.path.join(LEV, "data", "models", "F-F_Research_Data_5_Factors_2x3.csv")
FFTC_CSV = os.path.join(LEV, "data", "models_tcosts", "ff_tc.csv")

# published squared-Sharpe differences vs FF5 (FF5 = 0 baseline)
GROSS_DIFF = {"FF5": 0.0, "FF6": 0.020, "HXZ": 0.037,
              "FundModel5": 0.073, "FundModel6": 0.081}   # srdiff.tex
NET_DIFF = {"FF5": 0.0, "FF6": 0.002, "HXZ": -0.023,
            "FundModel5": 0.048, "FundModel6": 0.046}     # srdiff_tc.tex
MODELS = ["FF5", "FF6", "HXZ", "FundModel5", "FundModel6"]


def sr2(F):
    """Bias-corrected squared Sharpe of the tangency portfolio (paper's _sr2)."""
    F = np.asarray(F, dtype=float)
    T, K = F.shape
    mu = F.mean(axis=0).reshape(-1, 1)
    Sigma = np.cov(F, rowvar=False, bias=True).reshape(K, K)
    W = (T - K - 2) / T * np.linalg.inv(Sigma)
    return float((mu.T @ W @ mu).item()) - K / T


def load_ff5():
    df = pd.read_csv(FF5_CSV, skiprows=3)
    df = df.rename(columns={df.columns[0]: "date"})
    df["date"] = df["date"].astype(str).str.strip()
    df = df[df["date"].str.fullmatch(r"\d{6}")].copy()        # monthly rows only
    df["period"] = pd.PeriodIndex(df["date"], freq="M")
    for c in ["Mkt-RF", "SMB", "HML", "RMW", "CMA"]:
        df[c] = pd.to_numeric(df[c], errors="coerce") / 100.0  # % -> decimal
    return df[["period", "Mkt-RF", "SMB", "HML", "RMW", "CMA"]]


def load_fftc():
    df = pd.read_csv(FFTC_CSV)
    df = df.rename(columns={df.columns[0]: "date"})
    df["period"] = pd.PeriodIndex(pd.to_datetime(df["date"]), freq="M")
    return df[["period", "smb", "hml", "rmw", "cma"]]


def main():
    ff5 = load_ff5()
    tc = load_fftc()
    m = ff5.merge(tc, on="period", how="inner")
    m = m[(m["period"] >= pd.Period("1976-01", "M")) &
          (m["period"] <= pd.Period("2022-12", "M"))].copy()
    print(f"sample: {m['period'].min()}..{m['period'].max()}  (T={len(m)})")
    print("FF5 leg trading-cost magnitude (mean monthly):",
          {c: round(m[c].mean(), 5) for c in ["smb", "hml", "rmw", "cma"]})

    gross_legs = m[["Mkt-RF", "SMB", "HML", "RMW", "CMA"]].to_numpy()
    net_legs = np.column_stack([
        m["Mkt-RF"].to_numpy(),                 # market: no trading cost
        (m["SMB"] - m["smb"]).to_numpy(),
        (m["HML"] - m["hml"]).to_numpy(),
        (m["RMW"] - m["rmw"]).to_numpy(),
        (m["CMA"] - m["cma"]).to_numpy(),
    ])
    ff5_gross = sr2(gross_legs)
    ff5_net = sr2(net_legs)
    print(f"FF5 gross SR^2 = {ff5_gross:.4f}   FF5 net SR^2 = {ff5_net:.4f}")

    rows = [{"model": k,
             "gross_sr2": ff5_gross + GROSS_DIFF[k],
             "net_sr2": ff5_net + NET_DIFF[k]} for k in MODELS]
    out = pd.DataFrame(rows)
    out.to_csv(os.path.join(DATA, "leverage_srsquared.csv"), index=False)
    print("\nlevels written to data/leverage_srsquared.csv:")
    print(out.round(4).to_string(index=False))
    print(f"\nsmell test: FundModel6 gross = {ff5_gross + GROSS_DIFF['FundModel6']:.3f} "
          f"(paper figure ~0.18)")


if __name__ == "__main__":
    main()
