import React from "react";
import { Box, Button, IconButton, InputBase, Paper } from "@mui/material";
import { ArrowBack, ArrowForward, Search } from "@mui/icons-material";

interface SearchBarProps {
  url: string;
  onUrlChange: (url: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

export function SearchBar({ url, onUrlChange, onSearch }: SearchBarProps) {
  return (
    <Paper
      sx={{
        bgcolor: "grey.50",
        p: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
 
      <IconButton
        aria-label="Geri git"
        onClick={() => console.log("Geri git")}
        size="small"
      >
        <ArrowBack />
      </IconButton>

      <IconButton
        aria-label="İleri git"
        onClick={() => console.log("İleri git")}
        size="small"
      >
        <ArrowForward />
      </IconButton>

   
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
          placeholder="Site adresini girin"
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
    </Paper>
  );
}
