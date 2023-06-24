import { useState, useEffect } from "react";
import "./Translator.css";
import flag from "../assets/rounded-fotor-bg-remover-20230511224520.png";

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [outputLang, setOutputLang] = useState("zh-Hans");
  const [outputText, setOutputText] = useState("");
  const [isTranslated, setIsTranslated] = useState();

  const translate = () => {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.REACT_APP_RapidAPI_Key,
        "X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
      },
      body: `[{"Text":"${inputText}"}]`,
    };

    fetch(
      `${process.env.REACT_APP_Base_URL}${outputLang}${process.env.REACT_APP_Query_Params}`,
      options
    )
      .then((response) => {
        if (response.status !== 200) {
          setIsTranslated(false);
          console.log("there's an error");
          return;
        }
        setIsTranslated(true);
        response.json().then((response) => {
          const translatedText = response[0].translations[0].text;
          setOutputText(translatedText);
          console.log(translatedText);
        });
      })
      .catch((err) => {
        setIsTranslated(false);
        console.error(err);
      });
  };

  const clearInput = () => {
    setInputText("");
    setOutputText("");
    setIsTranslated();
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      console.log("User pressed: ", event.key);

      if (event.key === "Enter") {
        event.preventDefault();

        translate();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <div className=" w-full text-center">
      <div>
        <select
          name="languages"
          id="languages"
          className=" hidden"
          onChange={(e) => setOutputLang(e.target.value)}
        >
          <option value="zh-Hans">Chinese</option>
        </select>
      </div>
      <div className=" mb-11">
        <div className=" flex justify-center mt-10">
          <img
            className=" justify-center w-10"
            src={flag}
            alt="china flag"
          ></img>
        </div>
        <h1 className=" text-5xl text-white font-semibold mt-10">
          Chinese mandarin character translator
        </h1>
        <p className=" text-white text-2xl mt-4">
          This is a simple app that lets you translate whatever word it is
          you're thinking into it's correspondent chinese simplified character
          or Hanzi
        </p>
      </div>
      <div className=" inline-block ">
        <form>
          <div>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs text-white bg-black text-xl"
              placeholder="Enter word to translate"
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
            ></input>
          </div>
        </form>{" "}
        {/* no tocar */}
        <div className=" mr-6">
          <button
            onClick={translate}
            className=" opacity-75 text-white text-xl m-9 font-bold"
          >
            TRANSLATE
          </button>
        </div>
        <div className="card w-96 shadow-xl bg-black">
          <div className="card-body">
            <h2 className="card-title text-white justify-center">
              Your character is...
            </h2>
            <p className=" text-white text-8xl">{outputText}</p>
            <div className="card-actions justify-end">
              <button
                className="opacity-75 text-white text-xl font-bold mt-8"
                onClick={clearInput}
              >
                {" "}
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
