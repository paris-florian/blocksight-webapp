import React, { useEffect, useState } from 'react';
import styles from './Sidebar.module.css';
import { DatasetSidebarElement, SidebarElement } from '../pages/Currency/Tabs/SuperchartTab/SuperchartTab';
import { Checkbox } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

interface MenuItem {
  type: 'toggle' | 'dropdown';
  icon: React.ReactNode;
  text: string;
  href?: string;
  isActive?: boolean;
  items?: string[];
}

// const menuItems: MenuItem[] = [
//   {
//     type: 'dropdown',
//     icon: (
//       <svg className='white-svg' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
//         <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Zm400-160v40q0 17 11.5 28.5T600-320q17 0 28.5-11.5T640-360v-40h40q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480h-40v-40q0-17-11.5-28.5T600-560q-17 0-28.5 11.5T560-520v40h-40q-17 0-28.5 11.5T480-440q0 17 11.5 28.5T520-400h40Z"/>
//       </svg>
//     ),
//     text: 'Create',
//     items: ['Folder', 'Document', 'Project']
//   },
//   {
//     type: 'dropdown',
//     icon: (
//       <svg className='white-svg' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
//         <path d="m221-313 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-228q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Zm0-320 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-548q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Zm339 353q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h280q17 0 28.5 11.5T880-320q0 17-11.5 28.5T840-280H560Zm0-320q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h280q17 0 28.5 11.5T880-640q0 17-11.5 28.5T840-600H560Z"/>
//       </svg>
//     ),
//     text: 'Todo-Lists',
//     items: ['Work', 'Private', 'Coding', 'Gardening', 'School']
//   },
//   {
//     type: 'dropdown',
//     icon: (
//       <svg className='white-svg' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
//         <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Zm400-160v40q0 17 11.5 28.5T600-320q17 0 28.5-11.5T640-360v-40h40q17 0 28.5-11.5T720-440q0-17-11.5-28.5T680-480h-40v-40q0-17-11.5-28.5T600-560q-17 0-28.5 11.5T560-520v40h-40q-17 0-28.5 11.5T480-440q0 17 11.5 28.5T520-400h40Z"/>
//       </svg>
//     ),
//     text: 'Create',
//     items: ['Folder', 'Document', 'Project']
//   },
//   {
//     type: 'dropdown',
//     icon: (
//       <svg className='white-svg' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
//         <path d="m221-313 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-228q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Zm0-320 142-142q12-12 28-11.5t28 12.5q11 12 11 28t-11 28L250-548q-12 12-28 12t-28-12l-86-86q-11-11-11-28t11-28q11-11 28-11t28 11l57 57Zm339 353q-17 0-28.5-11.5T520-320q0-17 11.5-28.5T560-360h280q17 0 28.5 11.5T880-320q0 17-11.5 28.5T840-280H560Zm0-320q-17 0-28.5-11.5T520-640q0-17 11.5-28.5T560-680h280q17 0 28.5 11.5T880-640q0 17-11.5 28.5T840-600H560Z"/>
//       </svg>
//     ),
//     text: 'Todo-Lists',
//     items: ['Work', 'Private', 'Coding', 'Gardening', 'School']
//   },
// ];

interface SidebarProps {
    sidebarElements: SidebarElement[];
    defaultSelected: DatasetSidebarElement[];
    setSelected: (selected: DatasetSidebarElement[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    
    const [selected, setSelectedState] = useState(
        props.sidebarElements.flatMap(e => e.type === 'DatasetSidebarElement' ? [e] : e.elements).map((c) => ({
            chart: c,
            selected: props.defaultSelected.some((s) => s.id === c.id),
        }))
    );

    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    const handleCheckboxChange = (checked: boolean, index: number) => {
        setSelectedState((prevSelected) => {
            const updatedSelected = [...prevSelected];
            updatedSelected[index] = {
                ...updatedSelected[index],
                selected: checked,
            };
            return updatedSelected;
        });
    };

    const toggleFolder = (folderId: string) => {
        setOpenFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    const renderElement = (element: DatasetSidebarElement, index: number) => {
        return (
            <div key={element.id} className={styles.element}>
                <Checkbox
                    checked={selected[index]?.selected}
                    onChange={(e) => handleCheckboxChange(e.target.checked, index)}
                    className={styles.checkbox}
                    {...label}
                />
                <div className={styles.elementName}>{element.name}</div>
            </div>
        );
    };

    const renderFolder = (folder: SidebarElement) => {
        if (folder.type !== 'FolderSidebarElement') return null;

        const isOpen = openFolders.has(folder.id);
        const folderElements = folder.elements.map((element, index) => {
            const globalIndex = props.sidebarElements
                .filter(e => e.type === 'DatasetSidebarElement')
                .findIndex(e => e.id === element.id);
            return renderElement(element, globalIndex);
        });

        return (
            <div key={folder.id} className={styles.folder}>
                <div 
                    className={styles.folderHeader}
                    onClick={() => toggleFolder(folder.id)}
                >
                    <KeyboardArrowRightIcon 
                        className={`${styles.folderIcon} ${isOpen ? styles.open : ''}`}
                    />
                    <div className={styles.elementName}>{folder.name}</div>
                </div>
                {isOpen && (
                    <div className={styles.folderContent}>
                        {folderElements}
                    </div>
                )}
            </div>
        );
    };

    const renderContent = () => {
        return props.sidebarElements.map((element, index) => {
            if (element.type === 'FolderSidebarElement') {
                return renderFolder(element);
            } else {
                return renderElement(element, index);
            }
        });
    };

    React.useEffect(() => {
        props.setSelected(
            selected.filter((item) => item.selected).map((item) => item.chart)
        );
    }, [selected]);

    return (
        <div className={styles.sidebar}>
            {renderContent()}
        </div>
    );
};

export default Sidebar; 