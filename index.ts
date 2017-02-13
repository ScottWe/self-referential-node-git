import * as express from "express";
import * as fs from "fs";
import * as git from "nodegit";
import * as path from "path";

const app = express();
const fn = "automated.txt";

app.get("/commit", (req, res) => {
  const timeStr = new Date();
  const text = timeStr + "\n";

  fs.appendFile(fn, text, (err) => {
    if (err) {
      console.error("Failed to write");
      res.status(500).send({ err: "Failed to write" });
      return;
    } else {
      let repo: git.Repository = null;
      let index: git.Index = null;
      let oid: git.Oid = null;

      git.Repository.open(path.resolve(__dirname, ".git"))
        .then((repoRes) => {
          repo = repoRes;
          return repo.refreshIndex();
        })
        .then((indexRes) => {
          index = indexRes;
          return index.addByPath(fn);
        })
        .then(() => {
          return index.write();
        })
        .then(() => {
          return index.writeTree();
        })
        .then((oidRes) => {
          oid = oidRes;
          return git.Reference.nameToId(repo, "HEAD");
        })
        .then((head) => {
          return repo.getCommit(head);
        })
        .then((parent) => {
          const sig = git.Signature.now("ScottWe", "scott.wesley@ns.sympatico.ca");
          const msg = "An automated commit at " + timeStr;

          return repo.createCommit("HEAD", sig, sig, msg, oid, [parent]);
        })
        .then(() => {
          return repo.getRemote("origin", () => { return; });
        })
        .then((remote) => {
          return remote.push(
            ["refs/heads/master:refs/heads/master"],
            {
              callbacks: {
                certificateCheck: () => 1,
                credentials: (url: string, userName: string) => {
                  // This is currently not working but works with plaintext pass
                  return git.Cred.sshKeyFromAgent(userName);
                }
              }
            }
          );
        })
        .then(() => {
          res.json({ status: "New commit" });
        });
    }
  });
});

app.listen(3000);
