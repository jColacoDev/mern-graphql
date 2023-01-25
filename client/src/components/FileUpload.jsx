import React, {useState, useMemo, useContext} from 'react'
import Resizer from "react-image-file-resizer";
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import Image from './Image';

export default function FileUpload({values, loading, setLoading, setValues}) {
    const {state} = useContext(AuthContext);
    const {images} = values;

    
    const resizeFile = (file) => new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            300,
            300,
            "JPEG",
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "base64"
        );
    });

    const fileResizeAndUpload = async (e) => {
        setLoading(true);

        try {
            const file = e.target.files[0];
            const image = await resizeFile(file);
            // console.log(image);
            axios.post(
                `${import.meta.env.VITE_REST_ENDPOINT}/uploadimages`,
                {image},
                {headers: {
                    authtoken: state.user.token
                }}
            )
            .then(response =>{
                setLoading(false);
                console.log('CLOUDINARY UPLOAD', response);
                setValues({...values, images: [...images, response.data]})
            })
            .catch(error =>{
                setLoading(false);
                console.log('CLOUDINARY UPLOAD FAILED', error);
            })
          } catch (err) {
            console.log(err);
          }    
    };

    const handleImageRemove = (id) => {
        setLoading(true);

        axios.post(
                `${import.meta.env.VITE_REST_ENDPOINT}/removeimage`,
                {
                    public_id: id
                },
                {
                    headers: {
                        authtoken: state.user.token
                    }
                }
            )
            .then((response) => {
                setLoading(false);
                let filteredImages = images.filter((item) => {
                    return item.public_id !== id;
                });
                setValues({ ...values, images: filteredImages });
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

  return (
    <div className="row">
        <div className="col-md-3">
            <div className="form-group">
                <label className="btn btn-primary">
                    Upload Image
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={fileResizeAndUpload}
                        className="form-control"
                        placeholder="Image"
                    />
                </label>
            </div>
        </div>
        <div className="col-md-9">
            {images.map((image) => (
                <Image key={image.public_id} 
                    image={image}
                    handleImageRemove={handleImageRemove}
                />
            ))}
        </div>
    </div>
  )
}
