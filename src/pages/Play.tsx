import { useState, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Chess, Square, PieceSymbol, Color } from "chess.js";
import {
  ArrowLeft,
  RotateCcw,
  FlipVertical,
  Copy,
  Check,
  Undo2,
  Cpu,
} from "lucide-react";
import RedoxChessEngine from "../utils/redoxchessEngine";
import {
  MoveHistoryEntry,
  formatChessMovePairs,
  calculateMaterialAdvantage,
} from "../utils/portfolioLogic";
import { config } from "../config";
import { GlassNavigation } from "../components/ui/GlassNavigation";
import "./Play.css";

// Crisp SVG chess pieces styled with calm ivory and slate-ink palette
const PIECES: Record<string, string> = {
  wK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#14171C" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><path stroke-linejoin="miter" d="M22.5 11.63V6M20 8h5"/><path fill="#FAF8F5" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#FAF8F5" d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7"/><path d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"/></g></svg>`,
  wQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#FAF8F5" fill-rule="evenodd" stroke="#14171C" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zm16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15L14 11v14L7 14l2 12z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"/></g></svg>`,
  wR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="#FAF8F5" fill-rule="evenodd" stroke="#14171C" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><path stroke-linecap="butt" d="M9 39h27v-3H9v3zm3-3v-4h21v4H12zm-1-22V9h4v2h5V9h5v2h5V9h4v5"/><path d="M34 14l-3 3H14l-3-3"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M31 17v12.5H14V17"/><path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/><path fill="none" stroke-linejoin="miter" d="M11 14h23"/></g></svg>`,
  wB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#14171C" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><g fill="#FAF8F5" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,
  wN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#14171C" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.6"><path fill="#FAF8F5" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#FAF8F5" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path fill="#14171C" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z"/></g></svg>`,
  wP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path fill="#FAF8F5" stroke="#14171C" stroke-width="1.6" stroke-linecap="round" d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></svg>`,
  bK: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#D4E0EC" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.63V6"/><path fill="#1F2937" d="M20 8h5"/><path fill="#1F2937" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#1F2937" d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7"/><path d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"/></g></svg>`,
  bQ: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#D4E0EC" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#1F2937"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path fill="#1F2937" stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"/><path fill="#1F2937" stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" stroke-linecap="butt" d="M11 38.5a35 35 1 0 0 23 0"/><path fill="none" d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0"/></g></svg>`,
  bR: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill-rule="evenodd" stroke="#D4E0EC" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#1F2937" stroke-linecap="butt" d="M9 39h27v-3H9v3zm3.5-7l1.5-2.5h17l1.5 2.5h-20zm-.5 4v-4h21v4H12z"/><path fill="#1F2937" stroke-linecap="butt" stroke-linejoin="miter" d="M14 29.5v-13h17v13H14z"/><path fill="#1F2937" stroke-linecap="butt" d="M14 16.5L11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"/><path fill="none" stroke-linejoin="miter" d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23"/></g></svg>`,
  bB: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#D4E0EC" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#1F2937" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g></svg>`,
  bN: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><g fill="none" fill-rule="evenodd" stroke="#D4E0EC" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#1F2937" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#1F2937" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path fill="#D4E0EC" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0zm5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z"/></g></svg>`,
  bP: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45"><path fill="#1F2937" stroke="#D4E0EC" stroke-width="1.5" stroke-linecap="round" d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/></svg>`,
};

const QUICK_OPENINGS = [
  { name: "King's Pawn (1. e4)", from: "e2" as Square, to: "e4" as Square },
  { name: "Queen's Pawn (1. d4)", from: "d2" as Square, to: "d4" as Square },
  { name: "Reti Opening (1. Nf3)", from: "g1" as Square, to: "f3" as Square },
];

const Play = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([]);
  const [capturedByWhite, setCapturedByWhite] = useState<string[]>([]);
  const [capturedByBlack, setCapturedByBlack] = useState<string[]>([]);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [gameStatus, setGameStatus] = useState<string>("White to move");
  const [engineDepth, setEngineDepth] = useState<number>(10);
  const [engineThinking, setEngineThinking] = useState(false);
  const [copiedFen, setCopiedFen] = useState(false);
  const redoxchessRef = useRef<RedoxChessEngine | null>(null);

  const files = boardFlipped
    ? ["h", "g", "f", "e", "d", "c", "b", "a"]
    : ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = boardFlipped
    ? ["1", "2", "3", "4", "5", "6", "7", "8"]
    : ["8", "7", "6", "5", "4", "3", "2", "1"];

  const updateGameStatus = useCallback((g: Chess) => {
    if (g.isCheckmate()) {
      setGameStatus(
        g.turn() === "w" ? "Checkmate — Engine wins" : "Checkmate — You win"
      );
    } else if (g.isDraw()) {
      if (g.isStalemate()) setGameStatus("Draw by stalemate");
      else if (g.isThreefoldRepetition()) setGameStatus("Draw by repetition");
      else if (g.isInsufficientMaterial()) setGameStatus("Draw by insufficient material");
      else setGameStatus("Draw");
    } else if (g.isCheck()) {
      setGameStatus(g.turn() === "w" ? "White is in check" : "Black is in check");
    } else {
      setGameStatus(g.turn() === "w" ? "White to move" : "Engine thinking...");
    }
  }, []);

  useEffect(() => {
    updateGameStatus(game);
  }, [game, updateGameStatus]);

  useEffect(() => {
    const engine = new RedoxChessEngine();
    redoxchessRef.current = engine;
    engine.init().catch(() => {});
    return () => {
      engine.quit();
    };
  }, []);

  const makeMove = useCallback(
    (from: Square, to: Square) => {
      try {
        const gameCopy = new Chess(game.fen());
        const move = gameCopy.move({ from, to, promotion: "q" });

        if (move) {
          if (move.captured) {
            if (move.color === "w") {
              setCapturedByWhite((prev) => [...prev, move.captured!]);
            } else {
              setCapturedByBlack((prev) => [...prev, move.captured!]);
            }
          }

          setMoveHistory((prev) => [
            ...prev,
            {
              from: move.from,
              to: move.to,
              piece: move.piece,
              captured: move.captured,
              san: move.san,
            },
          ]);

          setLastMove({ from, to });
          setGame(gameCopy);
          setSelectedSquare(null);
          setPossibleMoves([]);
          return true;
        }
      } catch {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
      return false;
    },
    [game]
  );

  // Trigger Engine Response when it's Black's turn
  useEffect(() => {
    if (game.turn() === "b" && !game.isGameOver()) {
      setEngineThinking(true);
      const engine = redoxchessRef.current;
      let fallbackTimer: number | undefined;

      const playFallbackRandomMove = () => {
        const legal = game.moves({ verbose: true });
        if (legal.length > 0) {
          const picked = legal[Math.floor(Math.random() * legal.length)];
          makeMove(picked.from as Square, picked.to as Square);
        }
        setEngineThinking(false);
      };

      if (engine && engine.isReady) {
        engine.setPosition(game.fen());
        fallbackTimer = window.setTimeout(playFallbackRandomMove, 3500);
        engine.getBestMove((bestMoveStr) => {
          if (fallbackTimer) clearTimeout(fallbackTimer);
          const from = bestMoveStr.substring(0, 2) as Square;
          const to = bestMoveStr.substring(2, 4) as Square;
          makeMove(from, to);
          setEngineThinking(false);
        }, engineDepth);
      } else {
        fallbackTimer = window.setTimeout(playFallbackRandomMove, 450);
      }

      return () => {
        if (fallbackTimer) clearTimeout(fallbackTimer);
      };
    }
  }, [game, engineDepth, makeMove]);

  const handleSquareClick = (square: Square) => {
    if (engineThinking || game.turn() !== "w") return;
    const piece = game.get(square) || null;

    if (selectedSquare) {
      if (possibleMoves.includes(square)) {
        makeMove(selectedSquare, square);
      } else if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setPossibleMoves(moves.map((m) => m.to as Square));
      } else {
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    } else if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square, verbose: true });
      setPossibleMoves(moves.map((m) => m.to as Square));
    }
  };

  const resetGame = () => {
    redoxchessRef.current?.stop();
    setEngineThinking(false);
    setGame(new Chess());
    setSelectedSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
    setCapturedByWhite([]);
    setCapturedByBlack([]);
    setLastMove(null);
    setGameStatus("White to move");
  };

  const undoLastPair = () => {
    if (moveHistory.length < 2 || engineThinking) return;
    const targetMoves = moveHistory.slice(0, -2);
    const rebuilt = new Chess();
    const capW: string[] = [];
    const capB: string[] = [];
    for (const m of targetMoves) {
      const res = rebuilt.move({ from: m.from, to: m.to, promotion: "q" });
      if (res?.captured) {
        if (res.color === "w") capW.push(res.captured);
        else capB.push(res.captured);
      }
    }
    setGame(rebuilt);
    setMoveHistory(targetMoves);
    setCapturedByWhite(capW);
    setCapturedByBlack(capB);
    const prevLast = targetMoves[targetMoves.length - 1];
    setLastMove(
      prevLast
        ? { from: prevLast.from as Square, to: prevLast.to as Square }
        : null
    );
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const handleCopyFen = async () => {
    try {
      await navigator.clipboard.writeText(game.fen());
      setCopiedFen(true);
      setTimeout(() => setCopiedFen(false), 2000);
    } catch {
      setCopiedFen(true);
      setTimeout(() => setCopiedFen(false), 2000);
    }
  };

  const renderPiece = (piece: { type: PieceSymbol; color: Color } | null) => {
    if (!piece) return null;
    const key = `${piece.color}${piece.type.toUpperCase()}`;
    const svg = PIECES[key];
    if (!svg) return null;
    return <div className="chess-piece" dangerouslySetInnerHTML={{ __html: svg }} />;
  };

  const isSquareLight = (file: string, rank: string): boolean => {
    const fileIndex = "abcdefgh".indexOf(file);
    const rankIndex = parseInt(rank, 10) - 1;
    return (fileIndex + rankIndex) % 2 === 1;
  };

  const renderCapturedPieces = (pieces: string[], color: Color) =>
    pieces.map((p, idx) => {
      const key = `${color}${p.toUpperCase()}`;
      return (
        <div
          key={idx}
          className="captured-piece"
          dangerouslySetInnerHTML={{ __html: PIECES[key] || "" }}
        />
      );
    });

  const formattedMoves = formatChessMovePairs(moveHistory);
  const material = calculateMaterialAdvantage(capturedByWhite, capturedByBlack);

  return (
    <div className="app-root play-page-shell">
      <GlassNavigation />

      <main
        id="main-content"
        className="section-shell"
        style={{
          paddingTop: "calc(var(--header-height) + var(--space-6))",
          maxWidth: "var(--container-wide)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            marginBottom: "var(--space-6)",
          }}
        >
          <div>
            <Link
              to="/"
              className="btn-ghost"
              style={{
                paddingLeft: 0,
                color: "var(--accent-primary)",
                marginBottom: "0.25rem",
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Portfolio</span>
            </Link>
            <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700 }}>
              WebAssembly Chess Arena
            </h1>
          </div>

          <div className="meta-inline">
            <span>Engine: RedoxChess / Stockfish WASM</span>
            <span className="meta-sep" aria-hidden="true">·</span>
            <span>Search Depth: {engineDepth} ply</span>
          </div>
        </div>

        <div className="chess-arena-grid">
          {/* Left Panel: Engine Configuration & Position Telemetry */}
          <aside className="glass-surface chess-telemetry-panel">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "var(--space-3)",
                }}
              >
                <Cpu size={18} style={{ color: "var(--accent-primary)" }} />
                <h2 style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>
                  Engine Parameters
                </h2>
              </div>

              <p style={{ fontSize: "var(--text-xs)", marginBottom: "var(--space-4)" }}>
                Client-side UCI chess engine running in a dedicated Web Worker thread.
                Select search depth or launch a standard opening below.
              </p>

              <div style={{ marginBottom: "var(--space-4)" }}>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Search Depth (Ply)
                </div>
                <div
                  className="segmented-control"
                  role="group"
                  aria-label="Engine search depth"
                  style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}
                >
                  {[
                    { depth: 6, label: "Fast (6)" },
                    { depth: 10, label: "Club (10)" },
                    { depth: 14, label: "Master (14)" },
                  ].map((item) => (
                    <button
                      key={item.depth}
                      type="button"
                      onClick={() => setEngineDepth(item.depth)}
                      aria-pressed={engineDepth === item.depth}
                      className={`segmented-btn ${
                        engineDepth === item.depth ? "active" : ""
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Opening Book Triggers when board is at move 0 */}
              <div style={{ marginBottom: "var(--space-4)" }}>
                <div
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Standard Opening Book (White)
                </div>
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  {QUICK_OPENINGS.map((op) => (
                    <button
                      key={op.name}
                      type="button"
                      disabled={moveHistory.length > 0 || engineThinking}
                      onClick={() => makeMove(op.from, op.to)}
                      className="btn-secondary"
                      style={{
                        justifyContent: "space-between",
                        minHeight: "38px",
                        padding: "0.35rem 0.75rem",
                        fontSize: "var(--text-xs)",
                        opacity: moveHistory.length > 0 ? 0.55 : 1,
                      }}
                    >
                      <span>{op.name}</span>
                      <span className="font-mono-tabular">{op.from}→{op.to}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Position FEN & Material Balance */}
            <div
              style={{
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--text-xs)",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-muted)",
                  }}
                >
                  Material Balance
                </span>
                <span
                  className="font-mono-tabular"
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {material.netWhite > 0
                    ? `White +${material.netWhite}`
                    : material.netWhite < 0
                    ? `Black +${Math.abs(material.netWhite)}`
                    : "Equal (0.0)"}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyFen}
                className="btn-secondary"
                style={{ width: "100%", minHeight: "40px", fontSize: "var(--text-xs)" }}
              >
                {copiedFen ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedFen ? "Copied FEN String" : "Copy Board FEN"}</span>
              </button>
            </div>
          </aside>

          {/* Center Panel: Interactive Chessboard */}
          <section className="chess-board-column" aria-label="Interactive chessboard">
            {/* Opponent Bar */}
            <div className="elevated-card player-strip">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <img
                  src={config.developer.portrait}
                  alt={config.developer.fullName}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-sm)",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 700 }}>
                    {config.developer.fullName} (Engine)
                  </div>
                  <div className="meta-inline">
                    <span>
                      {engineThinking ? "Calculating best line..." : `Depth ${engineDepth}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="captured-tray">
                {renderCapturedPieces(capturedByBlack, "w")}
              </div>
            </div>

            {/* 8x8 Board Grid */}
            <div className="chess-board-frame">
              <div className="chess-board" role="grid" aria-label="Chessboard">
                {ranks.map((rank) =>
                  files.map((file) => {
                    const square = `${file}${rank}` as Square;
                    const piece = game.get(square) || null;
                    const isLight = isSquareLight(file, rank);
                    const isSelected = selectedSquare === square;
                    const isPossibleMove = possibleMoves.includes(square);
                    const isLastMoveSquare =
                      lastMove && (lastMove.from === square || lastMove.to === square);
                    const isCheck =
                      game.isCheck() &&
                      piece?.type === "k" &&
                      piece?.color === game.turn();

                    return (
                      <button
                        type="button"
                        key={square}
                        aria-label={`Square ${square}${
                          piece
                            ? ` with ${piece.color === "w" ? "White" : "Black"} ${
                                piece.type
                              }`
                            : ""
                        }`}
                        className={`chess-square ${isLight ? "light" : "dark"} ${
                          isSelected ? "selected" : ""
                        } ${isLastMoveSquare ? "last-move" : ""} ${
                          isCheck ? "in-check" : ""
                        }`}
                        onClick={() => handleSquareClick(square)}
                      >
                        {file === (boardFlipped ? "h" : "a") && (
                          <span className="coord-rank">{rank}</span>
                        )}
                        {rank === (boardFlipped ? "8" : "1") && (
                          <span className="coord-file">{file}</span>
                        )}

                        {renderPiece(piece)}

                        {isPossibleMove && (
                          <span
                            className={`move-indicator ${piece ? "capture" : ""}`}
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Player Bar */}
            <div className="elevated-card player-strip">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--accent-steel-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "var(--text-xs)",
                    color: "var(--accent-primary)",
                  }}
                >
                  YOU
                </div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: 700 }}>
                    Challenger (White)
                  </div>
                  <div className="meta-inline">
                    <span>Click any White piece to move</span>
                  </div>
                </div>
              </div>
              <div className="captured-tray">
                {renderCapturedPieces(capturedByWhite, "b")}
              </div>
            </div>
          </section>

          {/* Right Panel: Match Status, Algebraic Move Log & Controls */}
          <aside className="glass-surface chess-history-panel">
            <div>
              <div
                className="elevated-card"
                style={{
                  padding: "0.75rem 1rem",
                  marginBottom: "var(--space-4)",
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: "var(--text-sm)",
                  color: game.isCheck()
                    ? "var(--status-danger)"
                    : "var(--text-primary)",
                }}
              >
                {gameStatus}
              </div>

              <div
                style={{
                  fontSize: "var(--text-xs)",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                Algebraic Notation ({moveHistory.length} half-moves)
              </div>

              <div className="move-history-scroll">
                {formattedMoves.length === 0 ? (
                  <div
                    style={{
                      padding: "2rem 1rem",
                      textAlign: "center",
                      fontSize: "var(--text-xs)",
                      color: "var(--text-muted)",
                    }}
                  >
                    No moves played yet. Select a White piece on the board or choose
                    an opening on the left.
                  </div>
                ) : (
                  formattedMoves.map((row) => (
                    <div key={row.moveNum} className="move-pair-row font-mono-tabular">
                      <span className="move-num-col">{row.moveNum}.</span>
                      <span className="move-san-col">{row.white}</span>
                      <span className="move-san-col">{row.black}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                paddingTop: "var(--space-4)",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={undoLastPair}
                  disabled={moveHistory.length < 2 || engineThinking}
                  className="btn-secondary"
                  style={{
                    minHeight: "42px",
                    fontSize: "var(--text-xs)",
                    opacity: moveHistory.length < 2 ? 0.5 : 1,
                  }}
                >
                  <Undo2 size={14} />
                  <span>Undo Turn</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBoardFlipped((f) => !f)}
                  className="btn-secondary"
                  style={{ minHeight: "42px", fontSize: "var(--text-xs)" }}
                >
                  <FlipVertical size={14} />
                  <span>Flip Board</span>
                </button>
              </div>

              <button
                type="button"
                onClick={resetGame}
                className="btn-primary"
                style={{ width: "100%", minHeight: "44px" }}
              >
                <RotateCcw size={15} />
                <span>New Game</span>
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Play;
