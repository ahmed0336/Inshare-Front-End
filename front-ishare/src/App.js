import logo from './logo.svg';
import './App.css';
import { DropzoneArea } from 'material-ui-dropzone';
import { useEffect, useState } from 'react';
import fileDownload from 'js-file-download';



function App() {

  // const [imagelist, Setimagelist] = useState([])


  // path link

  const [LinkPath, setLinkPath] = useState('')


  const [filelist, Setfilelist] = useState('')


  const [FileData, setFileData] = useState('')


  console.log("filename==>", filelist)

  const [URL, setURL] = useState('')

  console.log("pathname", URL)

  const [SenderEmail, setSenderEmail] = useState('')
  const [ReceiverEmail, setReceiverEmail] = useState('')


  // useEffect(()=>{

  //   GetPathName()

  // },[])

  const GetPathName = (ahmed) => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    // fetch("http://localhost:5000/files/ce3f5c80-c820-42ed-8b16-c1b224db7081", requestOptions)
    fetch(`http://localhost:5000/files/${ahmed}`, requestOptions)
      .then(response => response.json())
      .then(result => {

        console.log(result)
        setFileData(result.data)
      }
      )
      .catch(error => console.log('error', error));
  }

  const Uploadfile = () => {

    var formdata = new FormData();
    // formdata.append("myfile", fileInput.files[0], "/C:/Users/hnh/Downloads/bgsliderimg.jpeg");
    formdata.append("myfile", filelist);

    // for (var i = 0; i < imagelist.length; i++) {
    //   formdata.append("myfile", imagelist[i]);

    // }

    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/api/files", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("link==>", result.file)

        setLinkPath(result.file)



        let ahmed = result.file.split('/')[4]

        // console.log("split==>",ahmed)

        //  let pathname=ahmed[4]


        console.log("get  filename ==>", ahmed)

        setURL(ahmed)

        // Setfilelist('')


        GetPathName(ahmed)

      }

      )
      .catch(error => console.log('error', error));


  }

  const Downloadfiledata = () => {

    // console.log("url==>",URL)
    // let requestOptions = {
    //   method: 'GET',
    //   redirect: 'follow',
    //   responseType:"blob"
    // };

    // fetch(`http://localhost:5000/files/download/${URL}`, requestOptions)
    //   .then(response => response.json())
    //   .then(result => 
    //     {
    //       // fileDownload(result)
    //     console.log(result)

    //     }
    //     )
    //   .catch(error => console.log('error', error));

    fetch(`http://localhost:5000/files/download/${URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
      // responseType:"blob"
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `FileName.png`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });


  }

  const SendEmail = () => {
    // alert("hello baloch")
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "uuid": URL,
      "emailTo": SenderEmail,
      "emailFrom": ReceiverEmail
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/api/files/send", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }


  return (
    <div className="App">
      <h1>Upload File Here</h1>
      <div className="row">

        <div className='col-md-12 mb-2' >
          <DropzoneArea
            acceptedFiles={['image/*']}
            // filesLimit={12}
            filesLimit={1}
            // dropzoneText={"Drag and drop an image here or click"}
            showAlerts={false}
            onChange={
              (files) => {


                // setImage(e.target.files[0])
                // console.log('Files:', files)
                // Setimagelist(files)
                Setfilelist(files[0])
              }

            }



          />

          <button type='button' onClick={() => Uploadfile()} >Upload</button>

          {setLinkPath ? <button type='button' onClick={() => Downloadfiledata()} >Download File</button> : null}

          {
            LinkPath ?

              <h5>Downloads Link : {LinkPath}</h5>

              : null
          }



          {
            FileData ?

              <ul>
                <li>Path:  {FileData.path}</li>
                <li>FileSize : {FileData.size} kb</li>
              </ul>

              : null





          }

          <h1>send via Email</h1>
          <input placeholder='Send your Email' onChange={(e) => setSenderEmail(e.target.value)} />
          <input placeholder='Send receiver Email' onChange={(e) => setReceiverEmail(e.target.value)} />

          <button type='button' onClick={() => SendEmail()} >submit</button>



        </div>


      </div>
    </div>
  );
}

export default App;
