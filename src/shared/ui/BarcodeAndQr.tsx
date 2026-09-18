/**
 * Deterministic pseudo Code-128 barcode SVG generator
 * Renders crisp, scannable-looking 1D vertical bars
 */
export function BarcodeSvg({
  value,
  width = 220,
  height = 50,
  className = '',
}: {
  value: string;
  width?: number | string;
  height?: number;
  className?: string;
}) {
  // Generate a realistic sequence of bar widths based on input string
  const bars: { x: number; w: number }[] = [];
  let currentX = 10;
  
  // Guard quiet zone and start pattern
  bars.push({ x: currentX, w: 2 });
  currentX += 4;
  bars.push({ x: currentX, w: 1 });
  currentX += 3;
  bars.push({ x: currentX, w: 3 });
  currentX += 5;

  // Hash characters into bar/space sequences
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    const p1 = (code % 3) + 1;
    const p2 = ((code >> 1) % 3) + 1;
    const p3 = ((code >> 2) % 3) + 1;
    const p4 = ((code >> 3) % 2) + 1;

    bars.push({ x: currentX, w: p1 });
    currentX += p1 + p2;
    bars.push({ x: currentX, w: p3 });
    currentX += p3 + p4 + 1;
  }

  // Stop pattern and quiet zone
  bars.push({ x: currentX, w: 2 });
  currentX += 4;
  bars.push({ x: currentX, w: 3 });
  currentX += 5;
  bars.push({ x: currentX, w: 1 });
  currentX += 10;

  const totalWidth = currentX;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${height}`}
      width={width}
      height={height}
      className={className}
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0 auto' }}
    >
      <rect width={totalWidth} height={height} fill="#ffffff" />
      {bars.map((bar, idx) => (
        <rect
          key={idx}
          x={bar.x}
          y={0}
          width={bar.w}
          height={height}
          fill="#000000"
        />
      ))}
    </svg>
  );
}

/**
 * 2D QR Code SVG generator
 * Renders position markers (3 corners) and deterministic data modules
 */
export function QrCodeSvg({
  value,
  size = 140,
  className = '',
}: {
  value: string;
  size?: number | string;
  className?: string;
}) {
  const gridSize = 25; // 25x25 matrix (Version 2 QR)
  const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  const setCell = (r: number, c: number, val: boolean) => {
    const row = matrix[r];
    if (row && c >= 0 && c < gridSize) {
      row[c] = val;
    }
  };

  // Helper to mark a position detection pattern (7x7) at (row, col)
  const setFinderPattern = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 ||
          i === 6 ||
          j === 0 ||
          j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          setCell(r + i, c + j, true);
        } else {
          setCell(r + i, c + j, false);
        }
      }
    }
  };

  // 1. Top-Left
  setFinderPattern(0, 0);
  // 2. Top-Right
  setFinderPattern(0, gridSize - 7);
  // 3. Bottom-Left
  setFinderPattern(gridSize - 7, 0);

  // 4. Timing lines
  for (let i = 8; i < gridSize - 8; i++) {
    setCell(6, i, i % 2 === 0);
    setCell(i, 6, i % 2 === 0);
  }

  // 5. Alignment pattern at (16, 16)
  const alignR = 16;
  const alignC = 16;
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) {
        setCell(alignR + i, alignC + j, true);
      }
    }
  }

  // 6. Data payload distribution derived deterministically from value
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder and timing regions
      if (r < 8 && c < 8) continue;
      if (r < 8 && c >= gridSize - 8) continue;
      if (r >= gridSize - 8 && c < 8) continue;
      if (r === 6 || c === 6) continue;
      if (
        r >= alignR - 2 &&
        r <= alignR + 2 &&
        c >= alignC - 2 &&
        c <= alignC + 2
      )
        continue;

      // Pseudo-random bit based on position and value hash
      const bit = ((hash ^ (r * 37 + c * 17)) + (r * c)) % 3 === 0;
      setCell(r, c, bit);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${gridSize} ${gridSize}`}
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0 auto', shapeRendering: 'crispEdges' }}
    >
      <rect width={gridSize} height={gridSize} fill="#ffffff" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#000000" />
          ) : null
        )
      )}
    </svg>
  );
}
