const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

export const validateImage = (file) => {
    if(!ALLOWED_TYPES.includes(file.type)){
        return "Only JPEG, PNG or WebP images are allowed";
    }

    if(file.size > MAX_SIZE_MB * 1024 *1024){
        return `Image must be ${MAX_SIZE_MB} MB or smaller`;
    }
    return null;
}