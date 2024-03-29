import "./AddTech.scss";
import Button from "../../Buttons/Buttons";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddTech() {
  const API_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const validate = (values) => {
    const errors = {};
    if (!values.tech_name) {
      errors.tech_name = "Technique name required";
    }

    if (!values.type) {
      errors.type = "Type of technique required";
    }

    if (!values.level) {
      errors.level = "Level of technique require";
    }

    if (!values.description) {
      errors.description = "Description is required";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      tech_name: "",
      type: "",
      level: "",
      description: "",
    },

    validate,

    onSubmit: (values, { resetForm }) => {
      console.log("onSubmit values", values);
      axios
        .post(`${API_URL}/techs/add`, values)
        .then((addTech) => {
          console.log(addTech.data);
          alert("Addition was successful");
          resetForm();
        })
        .catch((err) => {
          console.error(err, "error at axios call at adding technique");
        });
    },
  });
  const handleReset = () => {
    window.location.reload();
  };

  const handleViewList = () => {
    console.log("cancel clicked");
    navigate("/techs");
  };

  return (
    <div className="add">
      <h3>Add to our Database</h3>
      <form onSubmit={formik.handleSubmit}>
        <div className="add__input-wrapper">
          <div className="add__input-set">
            <label className="add__label">Technique Name:</label>
            <input
              type="text"
              id="tech_name"
              name="tech_name"
              className={
                formik.errors.tech_name
                ? "add__field add__field--error"
                : "add__field"
              }
              value={formik.values.tech_name}
              onChange={formik.handleChange}
              />
          </div>
              {formik.errors.tech_name ? (
                <div>{formik.errors.tech_name}</div>
              ) : null}

          <div className="add__input-set">
            <label className="add__label">Type:</label>
            <input
              type="text"
              id="type"
              name="type"
              className={
                formik.errors.type
                ? "add__field add__field--error"
                : "add__field"
              }
              placeholder="Joint? Strangle? Sweep? Defense?"
              value={formik.values.type}
              onChange={formik.handleChange}
              />
          </div>
              {formik.errors.type ? <div>{formik.errors.type}</div> : null}

          <div className="add__input-set">
            <label className="add__label">Level:</label>
            <input
              type="text"
              id="level"
              name="level"
              className={
                formik.errors.level
                ? "add__field add__field--error"
                : "add__field"
              }
              placeholder="Beginner? Intermediate? Advanced?"
              value={formik.values.level}
              onChange={formik.handleChange}
              />
          </div>
              {formik.errors.level ? <div>{formik.errors.level}</div> : null}
          <div className="add__input-set">
            <label className="add__label"> Description:</label>
            <textarea
              type="text"
              id="desciption"
              name="description"
              className={
                formik.errors.description
                ? "add__textarea add__textarea--error"
                : "add__textarea"
              }
              placeholder="Please describe the technique"
              value={formik.values.description}
              onChange={formik.handleChange}
              ></textarea>
          </div>
        </div>
              {formik.errors.description ? (
                <div>{formik.errors.description}</div>
              ) : null}
        <div className="add__btn-container">
          <Button text="Add Technique" type="submit" modifer="__err"/>
          <Button
            text="Return to Full List"
            type="button"
            clickHandler={handleViewList}
          />
          <Button text="Reset" type="button" clickHandler={handleReset} />
        </div>
      </form>
    </div>
  );
}

export default AddTech;
