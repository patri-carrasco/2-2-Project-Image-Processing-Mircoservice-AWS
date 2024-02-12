import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from '../util/util.js';

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage", async (req, res) => {
    const imageUrl = req.query.image_url;
    console.log("dentro de server.js");
    console.log(imageUrl);
    if (!imageUrl) {
      return res
        .status(400)
        .json({ error: "Missing image_url query parameter" });
    }
    // if (!imageUrl.match(image_url_regex)) {
    //   res.status(400).send("image url format is incorrect, example url : https://some_domain(like google.com)/probably_some_more_paths/image_name.png/jpg/gif")
    // }
    try {
      console.log("entra en try");
      const filteredPath = await filterImageFromURL(imageUrl);
      console.log("llega del filteredPath", filteredPath);
      console.log(filteredPath);
      res.sendFile(filteredPath, {}, async (err) => {
        if (err) {
          return res.status(500).json({ error: "Error sending file" });
        }
        console.log("delete");
        await deleteLocalFiles([filteredPath]);
      });
    } catch (error) {
      console.log(error)
      return res
        .status(422)
        .json({ error: "Invalid image_url or unable to process image" });
    }
  });

  // app.use((req, res) => {
  //   res.status(404).json({ error: "Route not found" });
  // });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.status(200).send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
