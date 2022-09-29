import { Button, Grid } from "@mui/material";

export type CategoryType = {
  id: number;
  name: string;
};

interface CategoryProps {
  onClick: React.Dispatch<React.SetStateAction<number | null>>;
  selectedCategory: null | number;
  category: null | Array<CategoryType>;
}

function Category(props: CategoryProps) {
  const sxButton = {
    m: 1.2,
    width: 100,
    textTransform: "capitalize",
    fontFamily: "Josefin Sans",
    fontSize: 16,
    fontWeight: "bold",
  };
  const categoryButton = props.category?.map((eachType) => (
    <Button
      variant={eachType.id === props.selectedCategory ? "contained" : "text"}
      sx={sxButton}
      key={eachType.id}
      onClick={() => props.onClick(eachType.id)}
    >
      {eachType.name}
    </Button>
  ));
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "12%",
        mt: "2%",
      }}
    >
      {categoryButton}
      <Button
        variant={props.selectedCategory ? "text" : "contained"}
        sx={sxButton}
        key={-1}
        onClick={() => props.onClick(null)}
      >
        all
      </Button>
    </Grid>
  );
}

export default Category;
