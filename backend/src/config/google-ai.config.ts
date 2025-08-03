import { GoogleGenerativeAI } from "@google/generative-ai";
import { Env } from "./env.config";

const genAI = new GoogleGenerativeAI(Env.GEMINI_API_KEY);

export default genAI;
