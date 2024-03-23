import { useState, useEffect } from "react";
import Axios from "axios";

function Summary() {

  const [value, setValue] = useState(null);
  const [data, setData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [selected, setSelected] = useState(null)


  const [file,setFile] = useState()
  const handlesubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(process.env.REACT_APP_OPENAI_KEY),
      },
      body: JSON.stringify({
        prompt: value + '\n\nTl;dr',
        temperature: 0.1,
        max_tokens: Math.floor(value.length / 2),
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.5,
        stop: ['"""'],
      }),
    };

    fetch(
      "https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions",
      requestOptions
    )
      .then((response) => response.json())
      .then((dt) => {
        console.log(dt);
        const text = dt.choices[0].text;
        setSubmitting(false);

        localStorage.setItem("summary",
          JSON.stringify(
            data?.length > 0
              ? [...data, { id: new Date().getTime(), text: text }] :[...data, { id: new Date().getTime(), text: text }] )
        );

        fetchLocalStorage()

      }).catch(error => {
        setSubmitting(false);
        console.log(error)
      });

  };

  const fetchLocalStorage = async () => {
    const result = localStorage.getItem("summary");

    setData(JSON.parse(result)?.reverse());
  };

  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    }
  }

  const handleCopy = (txt) => {
    copyTextToClipboard(txt).then(() => {
      setSelected(txt.id)
      setIsCopy(true)

      setTimeout(() => {
        setIsCopy(false);
        setSelected(null)

      }, 1500);
    });
  };

  const handleDelete = (txt) => {

    const filtered = data?.filter((d) => d !== txt);
    setData(filtered);
    localStorage.setItem("summary", JSON.stringify(filtered));
  };

  const fileSetter = (e) =>{
    setFile(e.target.files[0])
  }

  const handleSubmitPDF = async (e) => {
    e.preventDefault();
    setSubmitting(true)




    var formData = new FormData();

    formData.append("filename", "User File");
    formData.append("uploadedFile", file);


    try {
      const { data: res } = await Axios.post("http://localhost:5000/summary",formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }})
      localStorage.setItem("summary", JSON.stringify([...data, res]))

      fetchLocalStorage()

    } catch (error) {
      console.log(error);
    }
    finally {
      setSubmitting(false)
    }


  }

  useEffect(() => {
    // localStorage.clear(); 
    fetchLocalStorage();
  }, []);


  useEffect(() => {
    // localStorage.clear(); 
    console.log('Data: ' + JSON.stringify(data))
  }, [data]);




  return (
    <div className="w-full bg-[#0f172a] h-full min-h-[100vh]
    py-4
    px-4
    md:px-20
    place-items-center"

    >

      <h3 class="text-3xl text-neutral-100 font-bold underline">
        PDF SUMMARY
      </h3>
      <div className='flex flex-col w-full items-center justify-center mt-5'>
        <textarea
          placeholder='Paste Content here ...'
          rows={6}
          className='block w-full md:w-[650px] rounded md border border-slate-706 
          bg-slate-800 p-2 text-sm shadow-lg font-medium text-white focus:border-grey-500 
          focus:outline-none focus:ring 0'
          onChange={(e) => setValue(e.target.value)}
        ></textarea>

        {value?.length > 0 && !submitting && (
          <button
            className='mt-5 bg-blue-500 px-5 py-2 text-white text-md font-
            cursor-pointer rounded-md
            '
            onClick={handlesubmit}
          >
            Submit
          </button>
        )}

        {!value?.length > 0 && (
          <div className="mt-5">
            <label htmlFor='userFile' className="text-white mr-2">
              Choose File
            </label>
            <input
              type='file'
              id='userFile'
              name='userFile'
              accept='.pdf'
              className="text-slate-300"
              onChange={(e) => fileSetter(e)}
            />
            {file &&(
              <button onClick={handleSubmitPDF}>Upload</button>
            )}
            
          </div>
        )}
        {submitting && (<p className='text-white text-lg'>Please wait...</p>

        )}

      </div>
      <div className="w-full mt-10 flex flex-col gap-5 shadow-md item-center justify-center">
        {data?.length > 0 && (
          <>
            <p className='text-white text-lg'>Summary History</p>

            {data?.map((d, index) => (
              
              <div
                key={index}
                className="max-w-2x1 bg-slate-800 p-3 rounded-md"
              >
                <p className='text-gray-400 text-lg'>{d?.text}</p>
                <div className="flex gap-5 items-center justify-end mt-2">
                  <p className='text-gray-500 font-semibold cursor-pointer'
                    onClick={() => handleCopy(d)}>
                    {isCopy && selected === d.id ? "Copied" : "Copy"}
                  </p>
                  <span className='cursor-pointer' onClick={() => handleDelete(d)}>
                    <p className='text-gray-500 font-semibold cursor-pointer'>
                      Delete
                    </p>
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );

}
export default Summary;
