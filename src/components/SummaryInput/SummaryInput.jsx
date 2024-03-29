import "./SummaryInput.scss";

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../Buttons/Buttons";
import axios from "axios";


function SummaryInput({ updateSummaryList }) {
  const API_URL = import.meta.env.VITE_BASE_URL;

  const [techs, setTechs] = useState([]);
  const [positions, setPositions] = useState([]);
  const params = useParams();

  // importing techniques from database
  useEffect(() => {
    axios
      .get(`${API_URL}/techs`)
      .then((techs) => {
        setTechs(techs.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [API_URL]);

  //importing position from database
  useEffect(() => {
    axios
      .get(`${API_URL}/positions`)
      .then((positions) => {
        setPositions(positions.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [API_URL]);

  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Title is required";
    }

    if (!values.date) {
      errors.date = "Please select data you trained";
    }

    if (!values.tech) {
      errors.tech = "Please select technique";
    }

    if (!values.position) {
      errors.position = "Please select a position";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      id: params.id,
      title: "",
      date: "",
      tech: "",
    
      position: "",
      summary: "",
      video: "",
    },

    validate,

    onSubmit: (values, { resetForm }) => {
      // check if a file/ video has been uploaded
      if(!values.video){
        axios
        .post(`${API_URL}/summary`, values)
        .then((response)=> {
        })
        .catch((err)=> {
          console.log(err, "error at posting summary without video")
        })
      }
      const formData = new FormData();
      formData.append("video", values.video);
      formData.append("position", values.position);
      formData.append("summary", values.summary);
      formData.append("date", values.date);
      formData.append("tech", values.tech);
      formData.append("title", values.title);
      formData.append("id", params.id);

      axios
        .post(`${API_URL}/summary`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          return axios.get(`${API_URL}/summary/${params.id}`)
        })
        .then((response)=> {
          const newSummary = response.data[0]
          updateSummaryList(newSummary)         
        })
        .catch((err) => {
          console.log(err, "error at Front end on submit");
        });
    
        resetForm();
    },
  });

  return (
    <div className="summary">
      <div className="summary__title">Enter a new training summary</div>
      <div>
        <form onSubmit={formik.handleSubmit} >
          <div className="summary-form__input-set">
            <label className="summary-form__label">Title</label>
            <input
              className={
                formik.errors.title
                ? "summary-form__field summary-form__field--error"
                : "summary-form__field"
              }
              id="title"
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              />
          </div>
              {formik.errors.title ? <div>{formik.errors.title}</div> : null}

          <div className="summary-form__input-set">
            <label className="summary-form__label">Date:</label>
            <input
              className={
                formik.errors.date
                ? "summary-form__field summary-form__field--error"
                : "summary-form__field"
              }
              id="date"
              type="date"
              name="date"
              placeholder=""
              value={formik.values.date}
              onChange={formik.handleChange}
              />
          </div>
              {formik.errors.date ? <div>{formik.errors.date}</div> : null}

          <div className="summary-form__input-set">
            <label className="summary-form__label">
              What technique did you learn?
            </label>
            <select
              id="tech"
              name="tech"
              className={
                formik.errors.tech
                ? "summary-form__field  summary-form__field--error"
                : "summary-form__field"
              }
              value={formik.values.tech}
              onChange={formik.handleChange}
              >
              <option value="" disabled="disabled">
                Select a Technique
              </option>
              {techs.map((tech) => (
                <option
                value={`${tech.tech_id}, ${tech.tech_name}`}
                key={tech.tech_id}
                >
                  {tech.tech_name}
                </option>
              ))}
            </select>
          </div>
              {formik.errors.tech ? <div>{formik.errors.tech}</div> : null}

         
            

          <div className="summary-form__input-set">
            <label className="summary-form__label">
              What Position did you start from?
            </label>
            <select
              id="position"
              name="position"
              className={
                formik.errors.position
                ? "summary-form__field summary-form__field--error"
                : "summary-form__field"
              }
              value={formik.values.position}
              onChange={formik.handleChange}
              >
              <option value="" disabled="disabled">
                Select a Position
              </option>
              {positions.map((position) => (
                <option
                value={`${position.position_id}, ${position.position_name}`}
                key={position.position_id}
                >
                  {position.position_name}
                </option>
              ))}
            </select>
          </div>
              {formik.errors.position ? (
                <div>{formik.errors.position}</div>
              ) : null}

          <div className="summary-form__input-set">
            <label className="summary-form__label">Summary</label>
            <textarea
              className="summary-form__field summary-form__textarea"
              id="summary"
              type="text"
              name="summary"
              placeholder="a brief summary of your learning"
              value={formik.values.summary}
              onChange={formik.handleChange}
            ></textarea>
          </div>

          <div className="summary-form__input-set">
            <label className="summary-form__label">Video Upload</label>
            <input
              className="summary-form__field summary-form__field--color"
              id="video"
              type="file"
              name="video"
              accept="video/*"
              onChange={(e) =>
                formik.setFieldValue("video", e.currentTarget.files[0])
              }
            />
          </div>

          <div className="summary-form__btn-container">
            <Button text="Add Summary" type="submit" />
            <Button text="Reset" type="reset" />
          </div>
        </form>
      </div>
    
    </div>
  );
}

export default SummaryInput;
