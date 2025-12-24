import Static from "../schemas/static.js";
import axios from "axios";

export let IS_LOCAL_SERVER = false;
export let LOCAL_SERVER = "";

export const connectLocalServer = async () => {
  try {
    const url = await Static.findOne({ label: "LocalServerURL" });
    await axios.get(url?.value);
    console.log("LocalServer Conected");
    IS_LOCAL_SERVER = true;
    LOCAL_SERVER = url?.value;
  } catch (error) {
    IS_LOCAL_SERVER = false;
  }
};
