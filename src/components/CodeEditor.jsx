import { useState, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";
import CodeMirror from "codemirror";
import "react-toastify/dist/ReactToastify.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets"; // Import closebrackets addon
import "codemirror/addon/edit/matchbrackets"; // Import matchbrackets addon
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/ambiance.css";
import * as Babel from "@babel/standalone";
import { ToastContainer, toast } from "react-toastify";
import CopyIcon from "../svgIcons/CopyIcon";
import SaveIcon from "../svgIcons/SaveIcon";
import UnlockIcon from "../svgIcons/UnlockIcon";
import LockIcon from "../svgIcons/LockIcon";
import CompileIcon from "../svgIcons/CompileIcon";

// theme options
const themeOptions = [
  "3024-day",
  "3024-night",
  "abcdef",
  "ambiance",
  "base16-dark",
  "base16-light",
  "blackboard",
  "cobalt",
  "darcula",
  "dracula",
  "duotone-dark",
  "duotone-light",
  "eclipse",
  "elegant",
  "erlang-dark",
  "hopscotch",
  "icecoder",
  "idea",
  "isotope",
  "lesser-dark",
  "liquibyte",
  "lucario",
  "material",
  "mbo",
  "mdn-like",
  "midnight",
  "monokai",
  "neat",
  "neo",
  "night",
  "nord",
  "oceanic-next",
  "panda-syntax",
  "paraiso-dark",
  "paraiso-light",
  "railscasts",
  "rubyblue",
  "seti",
  "shadowfox",
  "solarized",
  "the-matrix",
  "tomorrow-night-bright",
  "tomorrow-night-eighties",
  "ttcn",
  "twilight",
  "vibrant-ink",
  "xq-dark",
  "xq-light",
  "yeti",
  "yonce",
  "zenburn",
];

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [result, setResult] = useState("");
  const [theme, setTheme] = useState("ambiance");
  const [isLocked, setIsLocked] = useState(false);

  const codeMirrorRef = useRef(null);
  const codeMirrorInstanceRef = useRef(null); // Ref to store the CodeMirror instance

  // get item from loc storage
  useEffect(() => {
    const savedCode = localStorage.getItem("savedCode");
    if (savedCode) {
      setCode(savedCode);

      if (codeMirrorInstanceRef.current) {
        codeMirrorInstanceRef.current.setValue(savedCode);
      }
    }
  }, []);

  // code editor instance for display editor
  useEffect(() => {
    if (!codeMirrorInstanceRef.current) {
      codeMirrorInstanceRef.current = CodeMirror.fromTextArea(
        codeMirrorRef.current,
        {
          lineNumbers: true,
          mode: language,
          autoCloseBrackets: true,
          theme: theme,
          matchBrackets: true,
          lineWrapping: true,
          readOnly: isLocked,
        }
      );

      codeMirrorInstanceRef.current.on("change", (editor) => {
        setCode(editor.getValue());
      });
    } else {
      // Update theme if it changes
      codeMirrorInstanceRef.current.setOption("theme", theme);
    }
  }, [language, isLocked, theme]);

  // language select function
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  // compiling code using console.log only
  const handleCompile = () => {
    try {
      let logOutput = "";

      const originalConsoleLog = console.log;
      console.log = (...args) => {
        logOutput += args.join(" ") + "\n";
      };

      const compiledResult = Babel.transform(code, {
        presets: ["env"],
        plugins: ["transform-react-jsx"],
        filename: "input",
        sourceMaps: "inline",
        retainLines: true,
      }).code;

      eval(compiledResult);
      console.log = originalConsoleLog;
      if (logOutput === "") {
        setResult(
          "use console.log('string',outputtodispaly) for display output instead of return"
        );
      } else {
        setResult(logOutput);
        toast.success("Code Compiled Successfully!", {
          icon: <CompileIcon />,
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      setResult(error.message);
      toast.error("Write JavaScript Code!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // import theme dynamically from codemirror
  const handleThemeChange = async (selectedTheme) => {
    await import(`../../node_modules/codemirror/theme/${selectedTheme}.css`);
    setTheme(selectedTheme);
  };

  // copycode functionality
  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        toast("Code copied to clipboard!", {
          icon: <CopyIcon />,
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.error("Copy failed: ", error);
      });
  };
  // save code functionality
  const handleSaveCode = () => {
    localStorage.setItem("savedCode", code);
    toast.success("Code Saved!", {
      icon: <SaveIcon />,
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  // toggle lock unlock
  const toggleLockEditor = () => {
    if (!isLocked) {
      toast.error("Editor Locked!", {
        icon: <LockIcon />,
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.success("Editor Unlocked!", {
        icon: <UnlockIcon />,
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setIsLocked(!isLocked);
    // Update the readOnly option of CodeMirror
    if (codeMirrorInstanceRef.current) {
      codeMirrorInstanceRef.current.setOption("readOnly", !isLocked);
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      <div className="heading">
        <Typewriter
          options={{
            strings: [
              "react basic code editor",
              "console.log('hello');",
              "output:hello",
            ],
            autoStart: true,
            loop: true,
          }}
        />
      </div>
      <div className="main-container">
        <div className="button-editor-container">
          <div className="btn-section">
            <div className="theme-lang-container">
              <div className="theme-select">
                <label>Theme : </label>
                <select
                  value={theme}
                  onChange={(e) => handleThemeChange(e.target.value)}
                >
                  {themeOptions.map((themeName) => (
                    <option key={themeName} value={themeName}>
                      {themeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="language-select">
                <label>Language : </label>
                <select value={language} onChange={handleLanguageChange}>
                  <option value="javascript">JavaScript</option>
                  {/* you can use other language options */}
                </select>
              </div>
            </div>
            <div className="operation-select">
              <div>
                <label>Operations : </label>
              </div>
              <div className="btns">
                <button onClick={handleCopyCode}>
                  Copy
                  <CopyIcon />
                </button>
                <button onClick={handleSaveCode}>
                  Save
                  <SaveIcon />
                </button>
                <button onClick={toggleLockEditor}>
                  {isLocked ? (
                    <>
                      Unlock Editor
                      <UnlockIcon />
                    </>
                  ) : (
                    <>
                      Lock Editor
                      <LockIcon />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="editor-screen">
            <textarea ref={codeMirrorRef} defaultValue={code} />
            {isLocked ? (
              <div className="lock-unlock-sign">
                <div className="lock">
                  <LockIcon />
                </div>
              </div>
            ) : (
              <div className="lock-unlock-sign-hide">
                <div className="unlock">
                  <UnlockIcon />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="code-editor-screen">
          <div className="result-screen">
            <div className="compile-select">
              <label>Output : </label>
              <button onClick={handleCompile}>
                Compile
                <CompileIcon />
              </button>
            </div>
            <div className="output">
              <div className={`CodeMirror cm-s-${theme}`}>OUTPUT :{result}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
