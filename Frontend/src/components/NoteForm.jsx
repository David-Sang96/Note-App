/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Field, Form, Formik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdAddCard } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";
import { UserContext } from "../contexts/UserContext";
import ErrorMessageStyle from "./ErrorMessageStyle";

const NoteForm = ({ isCreate }) => {
  const [oldNote, setOldNote] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [showImageUploadBox, setShowImageUploadBox] = useState(false);
  const fileRef = useRef();
  const { token } = useContext(UserContext);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!isCreate) {
      setShowImageUploadBox(true);
      fetchOldNote();
    }
  }, []);

  const API = `${import.meta.env.VITE_API_URL}`;

  const initialValues = {
    title: isCreate ? "" : oldNote.title || "",
    content: isCreate ? "" : oldNote.content || "",
    note_id: isCreate ? "" : oldNote._id || "",
    cover_image: isCreate ? null : oldNote.cover_image || "",
  };

  const imageSource = previewImage
    ? previewImage
    : oldNote.cover_image && `${API}/${oldNote.cover_image}`;

  // const validate = (values) => {
  //   const errors = {};
  //   if (values.title.trim().length < 10) {
  //     errors.title = "Title must have at least 5 letters";
  //   }
  //   if (values.content.length === 0) {
  //     errors.content = "write your content before saving your note";
  //   }
  //   return errors;
  // };

  const fetchOldNote = async () => {
    try {
      const res = await fetch(`${API}/edit/${id}`, {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      });
      if (!res.ok) {
        navigate("/");
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Zoom,
        });
      }

      const data = await res.json();
      setOldNote(data);
    } catch (err) {
      console.log(err);
    }
  };

  const SUPPORTED_FORMATS = ["image/png", "image/jpg", "image/jpeg"];

  const NoteFormSchema = Yup.object({
    title: Yup.string()
      .min(3, "TItle is too short!")
      .max(60, "Title is too long!")
      .required("Please write title!"),
    content: Yup.string()
      .min(5, "Content is too short!")
      .required("Please write your content !"),
    cover_image: Yup.mixed()
      .nullable()
      .test(
        "FILE_FORMAT",
        "Please upload the image file with jpg/png/jpeg extension",
        (value) => {
          if (oldNote.cover_image) {
            return true;
          }
          return !value || SUPPORTED_FORMATS.includes(value.type);
        }
      ),
  });

  const handleImageUpload = (event, setFieldValue) => {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
      setPreviewImage(URL.createObjectURL(selectedImage));
      setFieldValue("cover_image", selectedImage);
    }
  };

  const handleCancelImageUpload = (setFieldValue) => {
    setPreviewImage(null);
    setFieldValue("cover_image", null);
    fileRef.current.value = "";
  };

  const submitHandler = async (values) => {
    let route;
    let method;
    if (isCreate) {
      route = `${API}/create`;
      method = "POST";
    } else {
      route = `${API}/edit/${id}`;
      method = "PUT";
    }

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("note_id", values.note_id);
    formData.append("cover_image", values.cover_image);

    const res = await fetch(route, {
      method,
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
      body: formData,
    });
    const responseData = await res.json();
    if (res.ok) {
      navigate("/");
    } else {
      toast.error(responseData.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
      });
    }
  };

  return (
    <section className="px-2 pb-10 mx-auto lg:w-1/2 lg:px-0">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
      <h1 className="mb-5 text-xl font-medium text-center text-teal-500 md:text-2xl md:mb-8">
        {isCreate ? "Create a new note." : "Edit your note."}
      </h1>
      <div className="flex justify-end ">
        <Link to={"/"}>
          <IoMdArrowRoundBack className="w-10 p-1 text-3xl text-white bg-teal-600 rounded-md md:text-4xl" />
        </Link>
      </div>

      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={NoteFormSchema}
        onSubmit={submitHandler}
      >
        {({ errors, touched, values, setFieldValue, isSubmitting }) => (
          <Form
            encType="multipart/form-data"
            className="space-y-2 md:space-y-4 dark:text-black"
          >
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="font-medium text-teal-500 md:text-xl"
              >
                Note Title
              </label>
              <Field
                type="text"
                name="title"
                className="w-full py-1 border-2 border-teal-500 rounded-lg outline-none ps-1 md:py-2"
              />
              <ErrorMessageStyle name="title" />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="content"
                className="font-medium text-teal-500 md:text-xl"
              >
                Note Content
              </label>
              <Field
                as="textarea"
                type="text"
                cols={30}
                rows={5}
                name="content"
                className="w-full py-1 border-2 border-teal-500 rounded-lg outline-none ps-1"
              />
              <ErrorMessageStyle name="content" />
            </div>
            {(oldNote.cover_image || isCreate) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div>
                      <label
                        htmlFor="title"
                        className="font-medium text-teal-500 md:text-xl"
                      >
                        Cover Image (Optional)
                      </label>
                    </div>
                    {!showImageUploadBox && isCreate && (
                      <div className="px-2 py-1 my-3 text-sm text-center text-white bg-teal-600 border-2 border-teal-600 rounded-md md:text-base md:px-0">
                        <button
                          type="button"
                          onClick={() => setShowImageUploadBox(true)}
                        >
                          Click to upload the image
                        </button>
                      </div>
                    )}
                  </div>
                  {previewImage && (
                    <ImCross
                      className="p-1 text-2xl text-white bg-teal-600 rounded-md cursor-pointer "
                      onClick={() => handleCancelImageUpload(setFieldValue)}
                    />
                  )}
                </div>
                <input
                  type="file"
                  name="cover_image"
                  ref={fileRef}
                  hidden
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                />
                {showImageUploadBox && (
                  <div
                    className="relative flex items-center justify-center overflow-hidden border border-teal-600 border-dashed rounded-lg cursor-pointer h-36 md:h-72"
                    onClick={() => {
                      fileRef.current.click();
                    }}
                  >
                    <FaUpload className="z-10 text-xl text-teal-600 md:text-2xl" />
                    {isCreate ? (
                      <>
                        {previewImage && (
                          <img
                            src={previewImage}
                            alt="preview"
                            className="absolute top-0 left-0 object-cover w-full h-full opacity-35"
                          />
                        )}
                      </>
                    ) : (
                      <>
                        {imageSource && (
                          <img
                            src={imageSource}
                            alt="preview"
                            className={`absolute top-0 left-0  object-cover w-full h-full opacity-35`}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}
                <ErrorMessageStyle name="cover_image" />
              </div>
            )}
            <div className="flex justify-center pt-2 md:pt-0">
              <button
                className="flex items-center gap-1 px-5 py-1 text-white bg-teal-600 rounded-full text-md md:text-xl md:py-1 md:px-8"
                type="submit"
                disabled={isSubmitting}
              >
                <MdAddCard />
                <span>
                  {isCreate
                    ? `${isSubmitting ? "Uploading..." : "Create Note"}`
                    : `${isSubmitting ? "Updating..." : "Update Note"}`}
                </span>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default NoteForm;
