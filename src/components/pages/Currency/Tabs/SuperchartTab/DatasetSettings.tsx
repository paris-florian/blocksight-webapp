import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, TextField } from "@mui/material";
import { DatasetSidebarElement, ISetting, ISettingValue, SettingType } from "./SuperchartTab";
import styles from './SuperchartTab.module.css';
import { set, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

interface DatasetSettingsProps {
    dataset: DatasetSidebarElement;
    onClose: () => void;
}

interface INamedSettingValue extends ISettingValue {
    name: string;
}
  
export const DatasetSettings: React.FC<DatasetSettingsProps> = ({ dataset, onClose }) => {
    const a = localStorage.getItem("chart-setting-"+ dataset.id);
    console.error(a)
    const parsedSettings: ISettingValue[] = a ? JSON.parse(a) : undefined;
    const [settingValues, setSettingValues] = useState<INamedSettingValue[]>(dataset.settings.map(s => {
        const p = parsedSettings.find(p => p.id === s.id);
        return p 
            ? { name: s.name, ...p} 
            : ({name: s.name, id: s.id, type: s.type, value: s.defaultValue })
    }));
    
    const renderSetting = (name: string, setting: ISettingValue, index: number) => {
        switch (setting.type) {
            case SettingType.Percentage:
                return <TextField 
                    type="number"
                    onChange={(v) => {
                        settingValues[index] = {...settingValues[index], value: v.target.value };
                        setSettingValues([...settingValues])}}
                    sx={{width: "100%"}} 
                    id="outlined-basic" 
                    label={name} 
                    variant="filled" 
                    defaultValue={setting.value}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position='end'>
                                <div style={{color: "white"}}>%</div>
                            </InputAdornment>
                        ),
                    }} 
                />;
            default:
                return <TextField 
                    id="outlined-basic" 
                    label={name} 
                    variant="filled" 
                />;
        }
    };

    const onSave = () =>  {
        localStorage.setItem("chart-setting-"+ dataset.id, JSON.stringify(settingValues))
        onClose();
    }

    useEffect(() => {
        console.error(settingValues);
    }, [settingValues])

    return (
        <Dialog
            open={dataset !== undefined}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className={styles.dialog}
            sx={{
                "& .MuiDialog-container": {
                    "& .MuiPaper-root": {
                        width: "100%",
                        maxWidth: "350px",
                    },
                },
            }}
        >
            <DialogTitle id="alert-dialog-title" sx={{color: "white"}}>
                Settings: {dataset?.name}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{color: "#BEBBC3"}}>
                    The total DEX trading volume of wallets associated with a trader, which meets the following criteria:
                </DialogContentText>
                <div className={styles.settings}>
                    {settingValues.map((s, i) => renderSetting(s.name, s, i))}
                </div>
            </DialogContent>
            <DialogActions style={{display: "flex", justifyContent: "space-between", padding: "0 24px 24px 24px"}}>
                <Button 
                    sx={{background: "transparent", border: "1.5px solid white", color: "white", padding: "0.4rem 1.4rem"}} 
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button 
                    sx={{background: "white", color: "black", padding: "0.4rem 1.4rem"}} 
                    onClick={() => onSave()} 
                    autoFocus
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 