import {Button, Typography} from "@mui/material";
import {Link} from "react-router-dom";

export default function ViewPageButton({link, name}) {
    return (
        <Link to={link}>
            <Button
                variant="outlined"
                size="large"
                color="primary"
                sx={{
                    width: "20vw",
                    height: "20vh",
                    borderRadius: 4,
                }}
            >
                <Typography
                    fontWeight="bold"
                >
                    {name}
                </Typography>
            </Button>
        </Link>
    )
}