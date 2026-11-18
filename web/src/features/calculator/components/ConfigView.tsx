import { Box, Tab, Tabs } from "@mui/material";
import * as React from "react";
import { tabA11yProps, TabPanel } from "../../../components/TabPanel";
import ConfigBasicsTab from "./ConfigBasicsTab";
import ConfigStatsTab from "./ConfigStatsTab";
import ConfigMiscTab from "./ConfigMiscTab";
import ConfigMovesTab from "./ConfigMovesTab";

export default function ConfigView() {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab label="Basics" {...tabA11yProps(0)} />
          <Tab label="Stats" {...tabA11yProps(1)} />
          <Tab label="Misc" {...tabA11yProps(2)} />
          <Tab label="Moves" {...tabA11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <ConfigBasicsTab />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ConfigStatsTab />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ConfigMiscTab />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <ConfigMovesTab />
      </TabPanel>
    </>
  );
}
