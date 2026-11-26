import React, {useState, useEffect} from "react";
import { validateImage } from "../../utils/validateImage";

const ImagePicker = ({label = "Image", existingUrl = null, required = false, onChange}) => {
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        return () => {
            if(preview) {
                URL.revokeObjectURL(preview);
            }
        }
    }, [preview])

    const handleChange = (e) => {
        const file = e.target.files[0];
        console.log(e.target.files);
        if(!file){
            setPreview(null);
            onChange(null);
            return
        }
        const problem = validateImage(file);

        if(problem){
            setError(problem);
            setPreview(null);
            onChange(null);
            e.target.value = "";
            return;
        }

        setError("");
        setPreview(URL.createObjectURL(file));
        onChange(file);
    }

    const shownImage = preview || existingUrl;

    return(
        <div className="mb-3">
            <label htmlFor="form-label">{label}</label>
            <input type="file"
                accept="image/jpeg, image/png, image/wepg"
                className="form-control"
                onChange={handleChange}
                required={required}
            />
            {error && <div className="text-danger small mt-1">{error}</div>}

            {shownImage && 
                (<img
                src={shownImage} alt="Preview"
                className="img-thumbnail mt-2"
                style={{maxHeight: "180px"}}
                />)
            }
        </div>
    )
    
}

export default ImagePicker