import { useState } from 'react'
import './App.css'
import confetti from 'canvas-confetti'

import {TURNS} from "./constants"
import {Square} from "./components/Square"
import {isWinner, checkNewWinner} from "./logic/checkWinner"
import { resetGameStorage, saveGameStorage } from './logic/storage'
import { WinnerModal } from './components/WinnerModal'

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


  const updateBoard = (index) => {

    if(board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newWinner = isWinner(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)

    if(newWinner){
      confetti()
      setWinner(newWinner)
    }
    else if (checkNewWinner(newBoard)){
      setWinner(false)
    }
    saveGameStorage({
      board: newBoard,
      turn: newTurn
    })
  }

  const resetGame = () => {
    setWinner(null)
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    resetGameStorage()
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

        <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
  )
}

export default App
