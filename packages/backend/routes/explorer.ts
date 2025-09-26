app.get("/explorer", async (_req, res) => {
  try {
    const hashes = await yourContract.read.allContentHashes();
    const results = await Promise.all(
      hashes.map(async hash => {
        const [prompt, response, creator, ipfsID, timeStamp] =
          await yourContract.read.getContentByHash([hash]);
        return { hash, prompt, response, creator, ipfsID, timeStamp };
      })
    );
    res.json({ success: true, contents: results });
  } catch (err) {
    res.status(500).json({ error: "Failed to load explorer data" });
  }
});
