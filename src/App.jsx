import { useState } from 'react'
import './App.css'
import confetti from 'canvas-confetti'

const TURNS = {
  X : "×",
  O : "○"
}

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

const Square = ({ children, isSelected ,updateBoard , index}) => {
  const className = `square ${isSelected ? "is-selected" : ""}`

  const handleClick = () => {
    updateBoard(index)
  }
  return (
    <div className={className} onClick={handleClick}>
        {children}
    </div>
  )
}


function App() {

  const [winner, setWinner] = useState(null)
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board")
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromLocalStorage = window.localStorage.getItem("turn")
    return turnFromLocalStorage ?? TURNS.X
  })

  const isWinner = (boardToCheck) => {

    for (const combo of WINNER_COMBOS) {
    const [a, b, c] = combo
      if(
        boardToCheck[a] && 
        boardToCheck[a] === boardToCheck[b] && 
        boardToCheck[a] === boardToCheck[c] 
      ){
        return boardToCheck[a]
      }
    }
    return null
  }

  const updateBoard = (index) => {

    if(board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newWinner = isWinner(newBoard)

    const checkNewWinner = (newBoard) => {
      return newBoard.every((square) => square !== null)
    }

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    if(newWinner){
      confetti()
      setWinner(newWinner)
    }
    else if (checkNewWinner(newBoard)){
      setWinner(false)
    }

    window.localStorage.setItem("board", JSON.stringify(newBoard))
    window.localStorage.setItem("turn", newTurn)
  
  }

  const resetGame = () => {
    setWinner(null)
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)

    window.localStorage.removeItem("board")
    window.localStorage.removeItem("turn")
  }

  
  return (
    <main className='board'>
      <h1>Triki Trake</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className='game'>
        {
          board.map((_, index) => {
            return (  
              <Square key={index} index={index} updateBoard={updateBoard}> {board[index]} </Square>
            )
          })
        }
      </section>
      <section className='turn'>
        <Square isSelected={turn === TURNS.X}> {TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}> {TURNS.O}</Square>
      </section>

      {
        winner !== null && (
          <section className='winner'>
            <div className='text'>
              <h2>
                {
                  winner === false ? "empate" : `winner`
                }
              </h2>
              <header className='win'>
                { winner && <Square > {winner} </Square> }
              </header>
              <footer>
                <button onClick={resetGame}>empezar de nuevo</button>
              </footer>
            </div>
          </section>
        )
      }
    </main>
  )
}

export default App
