import './App.css'

function App() {

  return (
    <>
      <input
        type='file' multiple
      />
      <input
        type="file"
        multiple
        {...{
          webkitdirectory: "",
          directory: "",
        } as React.InputHTMLAttributes<HTMLInputElement>}
      />  
    </>
  )
}

export default App
