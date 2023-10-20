import './App.css'
import CodeEditor from './components/CodeEditor'

function App() {
  
  return (
    <>
      <CodeEditor />
      <div className='not-for-mobile'>
        <h1>This Code Editor only Work in Dekstop Mode Please Switch to Deksto</h1>
      </div>
    </>
  )
}

export default App
