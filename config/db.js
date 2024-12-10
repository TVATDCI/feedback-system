import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/feedback-system");
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if connection fails
  }
};
//feedback-system$ node server.js
//Server running on http://localhost:3000
//Successfully connected to MongoDB

{
  /** The same place again!
   * dci-student@dciadmin-ThinkPad-L15-Gen-4:~/webdev24/mongoose-mvc/feedback-system$ node server.js
(node:845596) [MONGODB DRIVER] Warning: useNewUrlParser is a deprecated option: useNewUrlParser has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
(Use `node --trace-warnings ...` to show where the warning was created)
(node:845596) [MONGODB DRIVER] Warning: useUnifiedTopology is a deprecated option: useUnifiedTopology has no effect since Node.js Driver version 4.0.0 and will be removed in the next major version
Server running on http://localhost:3000
Successfully connected to MongoDB

    import mongoose from "mongoose";

export const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/feedback-system", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if connection fails
  }
};

Deprecation Notice:

The options useNewUrlParser and useUnifiedTopology are now the default behavior in Mongoose 6.x and later.
Including these options in the connection string has no effect and generates warnings.
Clean Code:

By removing unnecessary options, the code becomes cleaner and avoids cluttering the console with warnings.
*/
}
