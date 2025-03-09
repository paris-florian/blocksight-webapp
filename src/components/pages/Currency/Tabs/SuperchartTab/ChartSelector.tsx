// import { Checkbox } from '@mui/material';
// import styles from './ChartSelector.module.css'
// import { useEffect, useState } from 'react';
// // import { SuperchartPane } from './SuperchartTab';

export interface IChart {
    id: string;
    name: string;
    // settings: IChartSettings;
    defaultSelected: boolean;
}

// export interface IChartSettings {

// }

// // import { useState } from 'react';
// // import { Checkbox } from '@mui/material';
// // // import styles from './yourStyles.module.css';
// // import { useState } from 'react';
// // import { Checkbox } from '@mui/material';
// // import styles from './yourStyles.module.css';
// export const ChartSelector = (props: { charts: SuperchartPane[], defaultSelected: SuperchartPane[], setSelected: (selected: SuperchartPane[]) => void }) => {
//     const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

//     // Initialize the state based on the default selected charts
//     const [selected, setSelectedState] = useState(
//         props.charts.map((c) => ({
//             chart: c,
//             selected: props.defaultSelected.some((s) => s.id === c.id),
//         }))
//     );

//     const handleCheckboxChange = (checked: boolean, index: number) => {
//         setSelectedState((prevSelected) => {
//             // Create a new array to ensure immutability
//             const updatedSelected = [...prevSelected];
//             updatedSelected[index] = {
//                 ...updatedSelected[index],
//                 selected: checked,
//             };


//             // Return the updated state for React to update the component
//             return updatedSelected;
//         });
//     };

//     useEffect(() => {
//         console.error(selected)
//             // Call the parent `setSelected` with the updated array
//             props.setSelected(
//                 selected.filter((item) => item.selected).map((item) => item.chart)
//             );
//     }, [selected])

//     const elem = selected.map((c, i) => (
//         <div className={styles.chart} key={c.chart.id}>
//             <Checkbox
//                 checked={c.selected}  // Use checked instead of defaultChecked
//                 onChange={(e) => handleCheckboxChange(e.target.checked, i)}  // Handle change
//                 {...label}
//             />
//             <div className={styles.chartName}>{c.chart.name}</div>
//         </div>
//     ));

//     return <div className={styles.chartSelector}>{elem}</div>;
// };