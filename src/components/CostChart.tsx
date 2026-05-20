export default function CostChart() {
  // Axes ranges — chosen so crossover (10亿, ¥2,500) sits at 25% / 25% of chart.
  // Tighter ranges = more visual breathing room for labels.
  const X_MAX = 40; // 40 亿 tokens / month
  const Y_MAX = 10000; // ¥10,000 / month

  const CROSS_X = 10;
  const CROSS_Y = 2500;

  const W = 880;
  const H = 480;
  const padL = 100;
  const padR = 64;
  const padT = 76; // extra top room for crossover annotation
  const padB = 80;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const xToPx = (x: number) => padL + (x / X_MAX) * innerW;
  const yToPx = (y: number) => padT + innerH - (y / Y_MAX) * innerH;

  const tickXs = [0, 10, 20, 30, 40];
  const tickYs = [0, 2500, 5000, 7500, 10000];

  const paygEndY = (X_MAX / CROSS_X) * CROSS_Y; // 4 × 2500 = 10000 → top edge
  const cross = { x: xToPx(CROSS_X), y: yToPx(CROSS_Y) };

  return (
    <div className="cost-chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="LLM Gateway 与 PAYG 月成本对比"
      >
        {/* Region shading */}
        <rect
          x={padL}
          y={padT}
          width={cross.x - padL}
          height={innerH}
          fill="#4a5670"
          opacity="0.05"
        />
        <rect
          x={cross.x}
          y={padT}
          width={padL + innerW - cross.x}
          height={innerH}
          fill="#DC580E"
          opacity="0.07"
        />

        {/* Y axis */}
        <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="#9B948A" strokeWidth="1" />
        {/* X axis */}
        <line
          x1={padL}
          y1={padT + innerH}
          x2={padL + innerW}
          y2={padT + innerH}
          stroke="#9B948A"
          strokeWidth="1"
        />

        {/* Y guide lines */}
        {tickYs.map((ty) =>
          ty > 0 ? (
            <line
              key={`yg${ty}`}
              x1={padL}
              y1={yToPx(ty)}
              x2={padL + innerW}
              y2={yToPx(ty)}
              stroke="#CCC6B5"
              strokeDasharray="2 4"
              strokeWidth="0.5"
            />
          ) : null,
        )}

        {/* X ticks */}
        {tickXs.map((tx) => {
          const px = xToPx(tx);
          const isCross = tx === CROSS_X;
          return (
            <g key={`x${tx}`}>
              <line
                x1={px}
                y1={padT + innerH}
                x2={px}
                y2={padT + innerH + 6}
                stroke={isCross ? "#DC580E" : "#9B948A"}
                strokeWidth={isCross ? 2 : 1}
              />
              <text
                x={px}
                y={padT + innerH + 26}
                textAnchor="middle"
                fontFamily="var(--mono)"
                fontSize="13"
                fontWeight={isCross ? 700 : 400}
                fill={isCross ? "#DC580E" : "#5C564C"}
              >
                {tx === 0 ? "0" : `${tx} 亿`}
              </text>
            </g>
          );
        })}

        {/* Y ticks */}
        {tickYs.map((ty) => {
          const py = yToPx(ty);
          const isCross = ty === CROSS_Y;
          return (
            <g key={`y${ty}`}>
              <line
                x1={padL - 6}
                y1={py}
                x2={padL}
                y2={py}
                stroke={isCross ? "#DC580E" : "#9B948A"}
                strokeWidth={isCross ? 2 : 1}
              />
              <text
                x={padL - 12}
                y={py + 5}
                textAnchor="end"
                fontFamily="var(--mono)"
                fontSize="13"
                fontWeight={isCross ? 700 : 400}
                fill={isCross ? "#DC580E" : "#5C564C"}
              >
                {ty === 0 ? "0" : `¥${ty.toLocaleString()}`}
              </text>
            </g>
          );
        })}

        {/* Axis titles */}
        <text
          x={padL + innerW / 2}
          y={H - 20}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="#3A352E"
          letterSpacing="0.16em"
          style={{ textTransform: "uppercase" }}
        >
          月度 token 用量
        </text>
        <text
          transform={`rotate(-90, 28, ${padT + innerH / 2})`}
          x={28}
          y={padT + innerH / 2}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="#3A352E"
          letterSpacing="0.16em"
          style={{ textTransform: "uppercase" }}
        >
          月度费用（人民币）
        </text>

        {/* Region labels — placed in roomy upper areas, not crammed at bottom */}
        <text
          x={padL + (cross.x - padL) / 2}
          y={padT + innerH * 0.4}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          letterSpacing="0.22em"
          fill="#4a5670"
          opacity="0.75"
          style={{ textTransform: "uppercase" }}
        >
          PAYG 更便宜
        </text>
        <text
          x={cross.x + (padL + innerW - cross.x) / 2}
          y={padT + innerH * 0.4}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fontWeight="700"
          letterSpacing="0.22em"
          fill="#DC580E"
          opacity="0.85"
          style={{ textTransform: "uppercase" }}
        >
          Gateway 越用越省
        </text>

        {/* PAYG line */}
        <line
          x1={xToPx(0)}
          y1={yToPx(0)}
          x2={xToPx(X_MAX)}
          y2={yToPx(paygEndY)}
          stroke="#4a5670"
          strokeWidth="3"
        />

        {/* Gateway line — horizontal */}
        <line
          x1={padL}
          y1={cross.y}
          x2={padL + innerW}
          y2={cross.y}
          stroke="#DC580E"
          strokeWidth="3"
        />

        {/* PAYG line label — top-right with background plate */}
        <g>
          <rect
            x={padL + innerW - 240}
            y={yToPx(paygEndY) + 18}
            width="230"
            height="38"
            fill="#F1EFE8"
            stroke="#CCC6B5"
            strokeWidth="0.5"
          />
          <text
            x={padL + innerW - 14}
            y={yToPx(paygEndY) + 36}
            textAnchor="end"
            fontFamily="var(--serif-cn)"
            fontWeight="700"
            fontSize="14"
            fill="#3A352E"
          >
            PAYG · 员工各自开账号
          </text>
          <text
            x={padL + innerW - 14}
            y={yToPx(paygEndY) + 52}
            textAnchor="end"
            fontFamily="var(--mono)"
            fontSize="11"
            fill="#5C564C"
          >
            y = k × 用量
          </text>
        </g>

        {/* Gateway line label — just above the line, with plate */}
        <g>
          <rect
            x={cross.x + 24}
            y={cross.y - 38}
            width="240"
            height="30"
            fill="#FFE6A8"
            stroke="#DC580E"
            strokeWidth="0.5"
          />
          <text
            x={cross.x + 36}
            y={cross.y - 18}
            fontFamily="var(--serif-cn)"
            fontWeight="700"
            fontSize="14"
            fill="#B8460A"
          >
            Gateway · 月固定费 ≈ ¥2,500
          </text>
        </g>

        {/* Crossover vertical dashed */}
        <line
          x1={cross.x}
          y1={cross.y}
          x2={cross.x}
          y2={padT + innerH}
          stroke="#DC580E"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Crossover circle */}
        <circle cx={cross.x} cy={cross.y} r="10" fill="#DC580E" stroke="#fff" strokeWidth="3" />

        {/* Crossover top annotation — single line, ample top padding */}
        <text
          x={cross.x}
          y={padT - 32}
          textAnchor="middle"
          fontFamily="var(--serif-cn)"
          fontWeight="700"
          fontSize="15"
          fill="#DC580E"
        >
          交点 · 10 亿 token / 月
        </text>
        <text
          x={cross.x}
          y={padT - 14}
          textAnchor="middle"
          fontFamily="var(--serif-cn)"
          fontSize="13"
          fill="#3A352E"
        >
          ≈ ¥2,500 / 月（约 $370）
        </text>
        <line
          x1={cross.x}
          y1={padT - 6}
          x2={cross.x}
          y2={cross.y - 12}
          stroke="#DC580E"
          strokeWidth="1"
        />
      </svg>
      <div className="cost-chart-legend">
        <div className="cost-legend-item">
          <span className="cost-legend-swatch payg"></span>
          <span>
            <strong>PAYG</strong> · 员工各自买顶级模型订阅 / 用各自 API，按用量计费 ——
            <em>y = k × 用量</em>
          </span>
        </div>
        <div className="cost-legend-item">
          <span className="cost-legend-swatch gw"></span>
          <span>
            <strong>Gateway 月固定费 ≈ ¥2,500</strong> · 含我方运维 ¥1,000 + 客户自购服务器 + LLM
            订阅账号 ——
            <em>y = a</em>
          </span>
        </div>
      </div>
    </div>
  );
}
