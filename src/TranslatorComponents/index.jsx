import { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import axios from 'axios'; // Import axios here
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const languages = require("language-list")();
const Translator = () => {
  const languageList = languages?.getData();
  const [inputLangFormat, setInputLangFormat] = useState("en");
  const [outputLangFormat, setOutputLangFormat] = useState("ta");
  const [inputVal, setInputVal] = useState("");
  const [translateText, setTranslatedText] = useState("Translation");
  const [openLoader, setOpenLoader] = useState(false);
  
  const handleChange = (event) => {
    setInputLangFormat(event.target.value);
  };

  const handleOutputFormatChange = (e) => {
    setOutputLangFormat(e.target.value);
    setTranslatedText('Translation');
  };

  const handleReverseLanguage = () => { 
    const value = inputLangFormat; 
    setInputLangFormat(outputLangFormat); 
    setOutputLangFormat(value); 
    setInputVal(translateText); 
    setTranslatedText(inputVal); 
  };

  
  const handleTranslate = async () => {
    setOpenLoader(true);

    const reqObj = {
      q: inputVal,
      target: outputLangFormat,
      source: inputLangFormat
    };

    const options = {
      method: 'POST',
      url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/json',
        'X-RapidAPI-Key': '52e83621b8msh10fd16a2702865fp110b58jsn3ef295659b77',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
      },
      data: reqObj,
    };

    try {
      const response = await axios.request(options);
      const translatedText = response?.data?.data?.translations[0]?.translatedText;
      setTranslatedText(translatedText || "Translation not found");
    } catch (error) {
      console.error(error);
      setTranslatedText("Translation not found");
    }

    setOpenLoader(false);
  };

  const handleInputChange = (e) =>{
    setInputVal(e.target.value)
  };
const handleReset = ()=>{
  setInputVal("")
}
const handleCopyClipBoard = ()=>{
  navigator.clipboard.writeText(translateText)
}
  return (
    <>
      <div className=" px-[7vw] mt-[150px] 2xl:px-0 mx-auto h-[400px] page-container border-[1px] rounded-md border-[#e3e2de] bg-[#faf9f5] my-auto">
        <div className="flex flex-row space-x-4 mt-8 justify-center items-center">
          <div>
            <FormControl className="">
              <Select
                value={inputLangFormat}
                onChange={handleChange}
                className="w-[300px]"
              >
                <MenuItem value={"en"}>Select</MenuItem>  
                {languageList?.map((el) => {
                  return <MenuItem value={el?.code}>{el?.language}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </div>
          <div>
            <SwapHorizIcon onClick={handleReverseLanguage} className=" cursor-pointer" />
          </div>
          <div>
            <FormControl fullWidth>
              <Select
                className="w-[300px]"
                value={outputLangFormat}
                onChange={handleOutputFormatChange}
              >
                <MenuItem value={""}>Select</MenuItem>
                {languageList?.map((el) => {
                  return <MenuItem value={el?.code}>{el?.language}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="flex">
          <div className="ml-[310px] mt-4">
            <textarea type="text" placeholder="Enter Text" value={inputVal} onChange={(e)=>handleInputChange(e)} className=" border-[1px] focus-within:outline-0 px-4 h-[200px] w-[300px] py-[4px] border620 bg-white rounder-[8px] shadow-[0px_4px_20px_rgba(238,238,238,0.5) resize-none" />
            {inputVal?.length !==0 && <CloseIcon onClick={handleReset} className="absolute left-[695px] mt-2 m-[5px] cursor-pointer" />}
          </div>
          <div className="mt-4 ml-14">
            <p className="border-[1px] focus-within:outline-0 px-4 h-[200px] w-[300px] py-[4px] border620 bg-white rounder-[8px] shadow-[0px_4px_20px_rgba(238,238,238,0.5) resize-none" >{translateText}</p>
            <ContentCopyIcon title="Copy to clipboard" onClick={handleCopyClipBoard} className="absolute right-[450px] mt-[-30px] cursor-pointer"/>
          </div>
        </div>
        <button onClick={handleTranslate} className="w-[650px] mt-6 relative p-[10px] border-2px border-[#6d9eed] rounded-md cursor-pointer text-[16px] bg-[#6d9eed] text-[#fff]">Translate</button>
      </div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={openLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Translator;
