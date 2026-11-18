import { Box } from "@mui/material";

interface ITabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: ITabPanelProps) {
  const { children, index, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      tabIndex={0}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function tabA11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tab-panel-${index}`,
  };
}
