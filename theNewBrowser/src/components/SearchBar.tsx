import React from "react";
import { Box, Button, IconButton, InputBase, Paper } from "@mui/material";
import { ArrowBack, ArrowForward, Search } from "@mui/icons-material";
import { HomePage } from "../pages/HomePage";

interface SearchBar {
  url: string;
  onUrlChange: (url: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export function SearchBar({ url, onUrlChange, onSearch }: SearchBar) {
  return (
    <Paper
      sx={{
        bgcolor: "grey.50",
        p: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Back Button */}
      <IconButton
        aria-label="Go back"
        onClick={() => console.log("Go back")}
        size="small"
      >
        <ArrowBack />
      </IconButton>

      {/* Forward Button */}
      <IconButton
        aria-label="Go forward"
        onClick={() => console.log("Go forward")}
        size="small"
      >
        <ArrowForward />
      </IconButton>

      {/* Search Form */}
      <Box
        component="form"
        onSubmit={onSearch}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <InputBase
          type="text"
          placeholder="Enter "
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          fullWidth
          sx={{
            px: 1,
            border: "1px solid #ccc",
            borderRadius: 2,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            ml: 2,
            bgcolor: "#f15d2f",
            "&:hover": { bgcolor: "#d14d1f" },
          }}
        >
          <Search />
        </Button>
      </Box>
      <Box>

      <HomePage
        centerUrl="" 
        onCenterUrlChange={(url) => console.log('Fake URL Change:', url)}
        onCenterSearch={(e) => {
          e.preventDefault();
          console.log('Fake search action triggered.');
        }} 
      ></HomePage>
      </Box>
    </Paper>
  );
}
