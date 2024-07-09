import { people } from "@googleapis/people";
import { authenticate } from "@google-cloud/local-auth";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/contacts.readonly"];

const contacts = [];

authenticate({
  scopes: SCOPES,
  keyfilePath: path.join(path.dirname("."), "credentials.json"),
})
  .then((auth) => {
    const P = people({ version: "v1", auth });
    return P;
  })
  .then((P) => {
    P.people.connections
      .list({
        resourceName: "people/me",
        personFields: "names,phoneNumbers",
      })
      .then((λ) => {
        const persons = λ.data;
        persons.connections.forEach((person) => {
          contacts.push({
            NAME: person.names[0].displayName,
            PHONE: person.phoneNumbers[0].value,
          });
        });
        console.table(contacts);
        console.log(`Total contacts: ${contacts.length}`);
      })
      .catch((err) => {
        console.error("======== FETCHING ERROR ========.");
        console.error(err);
      });
  })
  .catch((err) => {
    console.error("======== AUTHENTICATIOn ERROR ========.");
    console.error(err);
    process.exit(-1);
  });
