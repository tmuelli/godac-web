import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { tabA11yProps, TabPanel } from "./components/TabPanel";
import * as React from "react";
import CalcView from "./features/calculator/components/CalcView";
import ConfigView from "./features/calculator/components/ConfigView";
import FieldView from "./features/calculator/components/FieldView";

function App() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <main>
      <Stack>
        <Typography variant="h4">godac web</Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
          >
            <Tab label="Calc" {...tabA11yProps(0)} />
            <Tab label="Config" {...tabA11yProps(1)} />
            <Tab label="Field" {...tabA11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <CalcView />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ConfigView />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <FieldView />
        </TabPanel>
      </Stack>
    </main>
  );
}

export default App;
