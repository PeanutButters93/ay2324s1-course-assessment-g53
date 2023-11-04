import Question from "../model/Question.js";

 export async function getQuestionsByComplexity(req, res) {
     try {
         // Extract complexity from the request (e.g., from query parameters)
         const { complexity } = req.params;
         console.log(complexity, req.params)

         // If no complexity is provided, return an error response
         if (!complexity) {
           return res.status(400).send("Complexity parameter is required");
         }

         // Find one question with the specified complexity
         const question = await Question.aggregate([
             { $match: { complexity: complexity } },  // Filter by the specified complexity
             { $sample: { size: 1 } }                 // Get one random document
           ]).exec();

           // Since aggregate returns an array, extract the first element
           const randomQuestion = question[0];

         // If no question is found, return a not found response
         if (!randomQuestion) {
           return res.status(404).send("No question found for the specified complexity");
         }

         res.send(randomQuestion);
       } catch (error) {
         console.log(error);
         res.status(500).send("ERROR");
       }
 }
