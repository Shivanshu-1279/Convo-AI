import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import { OpenAIModel } from "@/types/Model";
import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

// Get your environment variables
dotenv.config();

// OpenAI configuration creation
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenAI instance creation
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  // if (req.method !== "POST") {
  //   res.status(405).json({ error: "Method not allowed" });
  //   return;
  // }

  const body = req.body;
  const messages = (body?.messages || []) as ChatCompletionRequestMessage[];
  const model = (body?.model || DEFAULT_OPENAI_MODEL) as OpenAIModel;

  try {
    // system
    const promptMessage: ChatCompletionRequestMessage = {
      role: "system",
      content: "You are ChatGPT. Respond to the user like you normally would.",
    };
    
    // user 
    const initialMessages: ChatCompletionRequestMessage[] = messages.splice(
      0,
      3
    );

    const latestMessages: ChatCompletionRequestMessage[] = messages
      .slice(-5)
      .map((message) => ({
        role: message.role,
        content: message.content,
      }));

    const completion = await openai.createChatCompletion({
      model: model.id,
      temperature: 0.5,
      messages: [promptMessage, ...initialMessages, ...latestMessages],
    });

    const responseMessage = completion.data.choices[0].message?.content.trim();

    if (!responseMessage) {
      res
        .status(400)
        .json({ error: "Unable get response from OpenAI. Please try again." });
    }

    res.status(200).json({ message: responseMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred during ping to OpenAI. Please try again.",
    });
  }
}




// import { NextApiRequest, NextApiResponse } from "next";
// import { Configuration, OpenAIApi } from "openai";
// import { OpenAIModel } from "@/types/Model";
// import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";

// // Import your environment variables
// import * as dotenv from "dotenv";

// // Get your environment variables
// dotenv.config();

// // OpenAI configuration creation
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // OpenAI instance creation
// const openai = new OpenAIApi(configuration);

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   // Extract message from request body
//     const body = req.body;
//   const { message } = req.body;
//   const model = (body?.model || DEFAULT_OPENAI_MODEL) as OpenAIModel;

//   try {
//     // Create a completion request to OpenAI API
//     const completion = await openai.createCompletion({
//       model: model.id,
//       prompt: message,
//       temperature: 0.5,
//       max_tokens: 50,
//     });

//     // Extract and return the generated text
//     const generatedText = completion.data.choices[0].text?.trim();

//     res.status(200).json({ message: generatedText });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "An error occurred while processing the request.",
//     });
//   }
// }
