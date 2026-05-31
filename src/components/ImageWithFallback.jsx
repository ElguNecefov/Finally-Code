// import { useState } from 'react';

// export function ImageWithFallback({ src, alt, className }) {
//   const [error, setError] = useState(false);

//   if (error) {
//     return (
//       <div className={className + ' bg-gray-200 flex items-center justify-center'}>
//         <span className="text-xs text-gray-500">Şəkil yoxdur</span>
//       </div>
//     );
//   }

//   return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
// }