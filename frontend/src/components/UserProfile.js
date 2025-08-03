import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { user, token } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    experience: "",
    education: "",
    profilePic: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (user && token) {
      axios
        .get(`/api/users/${user._id}`, {
          headers: { Authorization: token },
        })
        .then((res) => {
          const u = res.data;
          setFormData({
            bio: u.bio || "",
            skills: u.skills?.join(", ") || "",
            experience: JSON.stringify(u.experience || []),
            education: JSON.stringify(u.education || []),
            profilePic: u.profilePic || "",
          });
          setPreview(u.profilePic || "");
        })
        .catch(() => toast.error("Failed to fetch profile"));
    }
  }, [user, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await axios.post("/api/upload/image", formData, {
        headers: { Authorization: token },
      });
      return res.data.url;
    } catch (err) {
      toast.error("Image upload failed");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let profilePicURL = formData.profilePic;
    if (imageFile) {
      profilePicURL = await handleImageUpload();
    }

    const payload = {
      ...formData,
      profilePic: profilePicURL,
      skills: formData.skills.split(",").map((s) => s.trim()),
      experience: JSON.parse(formData.experience),
      education: JSON.parse(formData.education),
    };

    axios
      .put(`/api/users/${user._id}`, payload, {
        headers: { Authorization: token },
      })
      .then(() => toast.success("Profile updated!"))
      .catch(() => toast.error("Failed to update profile"));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      {preview && (
        <div className="text-center mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 mx-auto rounded-full object-cover border"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Your bio"
          className="input"
        />
        <input
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Skills (comma separated)"
          className="input"
        />
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder='[{"company":"ABC","role":"Dev","from":"2022","to":"2023"}]'
          className="input"
        />
        <textarea
          name="education"
          value={formData.education}
          onChange={handleChange}
          placeholder='[{"school":"XYZ","degree":"B.Tech","from":"2018","to":"2022"}]'
          className="input"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1"
        />

        <button type="submit" className="btn-primary w-full mt-3">
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
