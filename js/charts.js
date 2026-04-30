
const _chartsSignature = {
    id: "SSOD-SYL-2026-D6G9",
    author: "SYLVAH™",
    created: "2026-04-04",
    version: "2.0.0",
    module: "charts.js",
    hash: "c5f9e4d2a1b8f7c6"
};

const CHART_COLORS = {
    cyan:   "#00d4ff",
    green:  "#00ff88",
    red:    "#ff3860",
    orange: "#f5a623",
    purple: "#9b59b6",
    grid:   "rgba(0, 212, 255, 0.05)",
    text:   "#5a7a99",
};

const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: CHART_COLORS.text,
                font: { family: "Share Tech Mono", size: 11 }
            }
        }
    },
    scales: {
        x: {
            grid:  { color: CHART_COLORS.grid },
            ticks: { color: CHART_COLORS.text, font: { family: "Share Tech Mono", size: 10 } }
        },
        y: {
            grid:  { color: CHART_COLORS.grid },
            ticks: { color: CHART_COLORS.text, font: { family: "Share Tech Mono", size: 10 } }
        }
    }
};

function createCpuChart(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    return new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "CPU %",
                data,
                borderColor: CHART_COLORS.cyan,
                backgroundColor: "rgba(0, 212, 255, 0.08)",
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: CHART_COLORS.cyan,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            ...defaultOptions,
            plugins: {
                ...defaultOptions.plugins,
                tooltip: {
                    callbacks: { label: ctx => ` CPU: ${ctx.raw}%` }
                }
            },
            scales: {
                ...defaultOptions.scales,
                y: {
                    ...defaultOptions.scales.y,
                    min: 0, max: 100,
                    ticks: {
                        ...defaultOptions.scales.y.ticks,
                        callback: val => val + "%"
                    }
                }
            }
        }
    });
}

function createRamChart(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    return new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "RAM %",
                data,
                borderColor: CHART_COLORS.green,
                backgroundColor: "rgba(0, 255, 136, 0.08)",
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: CHART_COLORS.green,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            ...defaultOptions,
            scales: {
                ...defaultOptions.scales,
                y: {
                    ...defaultOptions.scales.y,
                    min: 0, max: 100,
                    ticks: {
                        ...defaultOptions.scales.y.ticks,
                        callback: val => val + "%"
                    }
                }
            }
        }
    });
}

function createDiskChart(canvasId, used, total) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    return new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Used", "Free"],
            datasets: [{
                data: [used, total - used],
                backgroundColor: [CHART_COLORS.orange, "rgba(255,255,255,0.05)"],
                borderColor:     [CHART_COLORS.orange, "rgba(255,255,255,0.1)"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: CHART_COLORS.text,
                        font: { family: "Share Tech Mono", size: 11 }
                    }
                }
            },
            cutout: "75%"
        }
    });
}

function createAlertsChart(canvasId, labels, data) {
    const ctx = document.getElementById(canvasId).getContext("2d");
    return new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Alerts",
                data,
                backgroundColor: [
                    "rgba(0,255,136,0.6)",
                    "rgba(245,166,35,0.6)",
                    "rgba(255,56,96,0.6)",
                    "rgba(255,0,0,0.8)"
                ],
                borderColor: [
                    CHART_COLORS.green,
                    CHART_COLORS.orange,
                    CHART_COLORS.red,
                    "#cc0000"
                ],
                borderWidth: 1
            }]
        },
        options: { ...defaultOptions }
    });
}

const _chartsMeta = {
    catalogId: "SYL-CHARTS-001",
    sourceCode: "SSOD2026",
    revision:   "SYL-v2"
};