export default function(req, res, next) {
  const paths = ["admin"];

  if (paths.includes(req.originalUrl.split("/")[1])) {
    res.spa = true;
  }
  next();
}
