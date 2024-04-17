// import * as React from "react";
// import LinearProgress, {
//   LinearProgressProps
// } from "@mui/material/LinearProgress";
// import Typography from "@mui/material/Typography";
// import Box from "@mui/material/Box";

// function LinearProgressWithLabel(
//   props: LinearProgressProps & { value: number }
// ) {
//   return (
//     <Box sx={{ display: "flex", alignItems: "center" }}>
//       <Box sx={{ width: "100%", mr: 1 }}>
//         <LinearProgress
//           variant="determinate"
//           sx={{
//             borderRadius: 20, // Adjust the border radius for rounded corners
//             height: 20 // Adjust the height to make it thicker
//           }}
//           {...props}
//         />
//       </Box>
//       <Box sx={{ minWidth: 35 }}>
//         <Typography variant="body2" color="text.secondary">{`${Math.round(
//           props.value
//         )}%`}</Typography>
//       </Box>
//     </Box>
//   );
// }

// export default function LinearWithValueLabel() {
//   const [progress, setProgress] = React.useState(0); // Initialize progress to 0

//   React.useEffect(() => {
//     // Function to set the progress value according to certain given values
//     const setProgressValue = () => {
//       const currentTime = new Date().getHours(); // Get the current hour
//       let newProgress = 0;

//       // Define progress values based on certain given conditions (e.g., time of day)
//       if (currentTime >= 0 && currentTime < 6) {
//         newProgress = 10;
//       } else if (currentTime >= 6 && currentTime < 12) {
//         newProgress = 30;
//       } else if (currentTime >= 12 && currentTime < 18) {
//         newProgress = 60;
//       } else {
//         newProgress = 90;
//       }

//       setProgress(newProgress);
//     };

//     setProgressValue(); // Initial call to set the progress value

//     // Set interval to update progress value based on certain conditions
//     const timer = setInterval(() => {
//       setProgressValue();
//     }, 60000); // Update every minute

//     // Cleanup function to clear the interval
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   return (
//     <Box sx={{ width: "100%" }}>
//       <LinearProgressWithLabel value={progress} />
//     </Box>
//   );
// }

// // linear progress with the percentege inside it
// function LinearProgressWithLabel(
//     props: LinearProgressProps & { value: number }
//   ) {
//     return (
//       <Box sx={{ display: "flex", alignItems: "center" }}>
//         <Box sx={{ position: "relative", width: "100%", mr: 1 }}>
//           <LinearProgress variant="determinate" {...props} />
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)"
//             }}
//           >
//             {`${Math.round(props.value)}%`}
//           </Typography>
//         </Box>
//       </Box>
//     );
//   }
