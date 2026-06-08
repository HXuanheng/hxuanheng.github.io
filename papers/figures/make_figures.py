#!/usr/bin/env python3
"""Generate theme-aware (light + dark) SVG figures for the paper landing pages.

Outputs 6 files into this directory:
  synergies-gwimp-likelihood-{light,dark}.svg   M&A Fig 3 panel (b)
  synergies-gwimp-intensity-{light,dark}.svg    M&A Fig 3 panel (d)
  leverage-srsquared-{light,dark}.svg           Gross & Net SR^2 by model

Inputs (small, committed in ./data so figures rebuild without Dropbox):
  data/synergies_gwimp_likelihood.csv, data/synergies_gwimp_intensity.csv
    (built by prep_synergies_data.py from the paper's funda_outcomes panel)
  data/leverage_srsquared.csv
    (built by prep_leverage_data.py: FF5 anchor + published SR^2 differences)

Run:  python make_figures.py
"""

import os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "data")

# ---- Theme palettes -------------------------------------------------------
# Colors are tuned to read on each page background (light #ffffff / dark #121212).
THEMES = {
    "light": dict(
        ink="#374151", grid="#374151", grid_alpha=0.12,
        blue="#3e54ac", red="#c1485b", gray="#9aa0ab",
        band_alpha=0.15,
    ),
    "dark": dict(
        ink="#cbd1dc", grid="#cbd1dc", grid_alpha=0.16,
        blue="#8ea2ff", red="#f4878f", gray="#6b7280",
        band_alpha=0.20,
    ),
}

FONT = {"family": "DejaVu Sans"}


def style_axes(ax, th):
    """Apply shared minimalist styling to an Axes for the given theme."""
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(th["ink"])
        ax.spines[side].set_linewidth(0.9)
    ax.tick_params(colors=th["ink"], labelsize=9.5, length=3)
    ax.yaxis.label.set_color(th["ink"])
    ax.xaxis.label.set_color(th["ink"])
    ax.title.set_color(th["ink"])
    ax.grid(axis="y", color=th["grid"], alpha=th["grid_alpha"], linewidth=0.8)
    ax.set_axisbelow(True)


PAGE_BG = {"light": "#ffffff", "dark": "#121212"}


def save(fig, name, theme):
    out = os.path.join(HERE, f"{name}-{theme}.svg")
    fig.savefig(out, format="svg", transparent=True, bbox_inches="tight")
    if os.environ.get("FIG_PNG") == "1":  # preview on the page background
        fig.savefig(os.path.join(HERE, "_preview", f"{name}-{theme}.png"),
                    format="png", dpi=130, facecolor=PAGE_BG[theme],
                    bbox_inches="tight")
    plt.close(fig)
    print("wrote", os.path.relpath(out, HERE))


HIGH = "High numeric guidance"
NONE = "No guidance"


# ---- M&A catch: goodwill-impairment event study (Fig 3 panels b & d) -------
def gwimp_figure(cache, ylabel, outname):
    df = pd.read_csv(os.path.join(DATA, cache))
    hi = df[df["group"] == HIGH].sort_values("event_year")
    no = df[df["group"] == NONE].sort_values("event_year")

    for theme, th in THEMES.items():
        fig, ax = plt.subplots(figsize=(4.7, 3.6))
        ax.axvline(0, color=th["ink"], lw=0.8, alpha=0.30, ls=(0, (4, 4)))
        ax.fill_between(no["event_year"], no["ci_lower"], no["ci_upper"],
                        color=th["gray"], alpha=th["band_alpha"], linewidth=0)
        ax.plot(no["event_year"], no["mean"], color=th["gray"], lw=2.2,
                marker="o", ms=4, label="No guidance")
        ax.fill_between(hi["event_year"], hi["ci_lower"], hi["ci_upper"],
                        color=th["blue"], alpha=th["band_alpha"], linewidth=0)
        ax.plot(hi["event_year"], hi["mean"], color=th["blue"], lw=2.6,
                marker="o", ms=4, label="High numeric guidance")
        ax.set_xlabel("Years from deal completion", fontsize=9.5)
        ax.set_ylabel(ylabel, fontsize=9.5)
        ax.set_xticks(range(-3, 4))
        ax.set_xlim(-3, 3)
        ax.set_ylim(bottom=0)
        style_axes(ax, th)
        leg = ax.legend(loc="upper left", frameon=False, fontsize=8.8)
        for txt in leg.get_texts():
            txt.set_color(th["ink"])
        save(fig, outname, theme)


# ---- Leverage: Gross & Net squared Sharpe ratio by model ------------------
def srsquared_figure():
    # Two bars per model (Gross SR^2, Net SR^2). Levels are anchored on FF5
    # (computed via the paper's _sr2 in prep_leverage_data.py) plus the paper's
    # exact published differences; cross-model differences are exact, the shared
    # FF5 baseline is approximate, so NO per-bar numeric labels are drawn.
    df = pd.read_csv(os.path.join(DATA, "leverage_srsquared.csv")).set_index("model")
    order = ["FF5", "FF6", "HXZ", "FundModel5", "FundModel6"]
    gross = df.loc[order, "gross_sr2"].to_numpy()
    net = df.loc[order, "net_sr2"].to_numpy()
    labels = ["FF5", "FF6", "HXZ\n(q-factor)", "Fund.\nModel 5", "Fund.\nModel 6"]
    x = np.arange(len(order))
    w = 0.38

    for theme, th in THEMES.items():
        fig, ax = plt.subplots(figsize=(5.2, 3.6))
        ax.bar(x - w / 2, gross, w, color=th["gray"], label="Gross SR$^2$")
        ax.bar(x + w / 2, net, w, color=th["blue"], label="Net SR$^2$")
        ax.set_xticks(x)
        ax.set_xticklabels(labels, fontsize=8.5)
        ax.set_ylabel("Maximum squared Sharpe ratio", fontsize=9.5)
        ax.set_ylim(0, max(gross) * 1.16)
        style_axes(ax, th)
        leg = ax.legend(loc="upper left", frameon=False, fontsize=9.0)
        for txt in leg.get_texts():
            txt.set_color(th["ink"])
        save(fig, "leverage-srsquared", theme)


def main():
    gwimp_figure("synergies_gwimp_likelihood.csv",
                 "Goodwill impairment likelihood (%)", "synergies-gwimp-likelihood")
    gwimp_figure("synergies_gwimp_intensity.csv",
                 "Goodwill impairment (% of assets)", "synergies-gwimp-intensity")
    srsquared_figure()


if __name__ == "__main__":
    main()
