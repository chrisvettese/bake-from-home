import React, {Fragment, useState} from "react";
import {Route} from "react-router-dom";
import {HashLink} from 'react-router-hash-link';
import Typography from "@material-ui/core/Typography";
import Rating from '@material-ui/lab/Rating';
import NavBar, {Divide, getRatingAverage} from "./Common";
import Grid from "@material-ui/core/Grid";

import recipeData from "./resources/recipeText";
import recipeReviews from "./resources/recipeReviews";
import Divider from "@material-ui/core/Divider";
import NotFound from "./NotFound";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = {
    recipeImage: {
        width: "24em",
        height: "auto"
    },
    recipeParagraph: {
        marginLeft: "10%",
        maxWidth: "70%",
        fontSize: "1.1em",
        whiteSpace: "pre-line"
    },
    recipeStandard: {
        marginLeft: "10%",
        maxWidth: "70%"
    },
    textField: {
        marginTop: "1em",
        marginLeft: "10%",
        width: "30em"
    }
};

function Recipes() {
    const path = window.location.pathname.substring(9);
    const rIndex = recipeData.paths.indexOf(path);
    let tmpIndex = rIndex;
    if (rIndex === -1) {
        tmpIndex = 0;
    }

    const [ratingAvg, setRatingAvg] = useState(getRatingAverage(recipeReviews.ratings[tmpIndex]));
    const [ratingAvgNum, setRatingAvgNum] = useState(parseFloat(ratingAvg));
    const [reviewWord, setReviewWord] = useState(recipeReviews.ratings[tmpIndex].length === 1 ? " review" : " reviews");
    const [reviewerNames, setReviewerNames] = useState(recipeReviews.reviewerNames[tmpIndex]);
    const [ratings, setRatings] = useState(recipeReviews.ratings[tmpIndex]);
    const [reviews, setReviews] = useState(recipeReviews.reviews[tmpIndex]);

    const [newName, setNewName] = useState("");
    const [newReview, setNewReview] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [showNameError, setShowNameError] = useState(false);

    if (rIndex === -1) {
        return (
            <NotFound/>
        );
    }

    function postReview() {
        if (newName === "") {
            setShowNameError(true);
            return;
        }
        const newNames = [newName].concat(reviewerNames);
        const newRatings = [newRating].concat(ratings);
        const newReviews = [newReview].concat(reviews);
        const newRatingAvg = getRatingAverage(newRatings);
        const newRatingAvgNum = parseFloat(ratingAvg);

        setReviewWord(newReviews.length === 1 ? " review" : " reviews");
        setReviewerNames(newNames);
        setRatingAvg(newRatingAvg);
        setRatingAvgNum(newRatingAvgNum);
        setRatings(newRatings);
        setReviews(newReviews);

        setNewName("");
        setNewRating(0);
        setNewReview("");
    }

    return (
        <Route path={"/recipes/" + path} key={path}>
            <NavBar/>
            <Typography align="center" variant="h3">{recipeData.names[rIndex] + "\u00a0"}</Typography>
            <Grid container justify="center">
                <Rating value={ratingAvgNum} precision={0.1} readOnly/>
                <Divider orientation="vertical" flexItem/>
                <Typography>{"\u00a0"}</Typography>
                <HashLink to={window.location.pathname + "#reviews"}>
                    <Typography
                        style={{fontSize: "1.1em"}}>{ratings.length + reviewWord}</Typography>
                </HashLink>
            </Grid>
            <br/>
            <Grid container justify="center">
                <img src={recipeData.images[rIndex]} alt={recipeData.names[rIndex]}
                     style={styles.recipeImage}/>
            </Grid>
            <br/>
            <Typography style={styles.recipeParagraph}>{recipeData.descriptions[rIndex]}</Typography>
            <Divide/>
            <Typography style={styles.recipeStandard} variant="h4">Ingredients</Typography>
            <Typography style={styles.recipeParagraph}>{recipeData.ingredients[rIndex]}</Typography>
            <Divide/>
            <Typography style={styles.recipeStandard} variant="h4">Instructions</Typography>
            <Typography style={styles.recipeParagraph}>{recipeData.instructions[rIndex]}</Typography>
            <Divide/>
            <Typography style={styles.recipeStandard} variant="h4" id="reviews">Reviews</Typography>
            <Grid container style={styles.recipeStandard}>
                <Typography style={{fontSize: "1.1em"}}>{ratingAvg + "\u00a0"}</Typography>
                <Divider orientation="vertical" flexItem/>
                <Typography>{"\u00a0"}</Typography>
                <Rating value={ratingAvgNum} precision={0.1} readOnly/>
                <Typography>{"\u00a0"}</Typography>
                <Divider orientation="vertical" flexItem/>
                <Typography
                    style={{fontSize: "1.1em"}}>{"\u00a0" + ratings.length + reviewWord}
                </Typography>
            </Grid>
            <br/>
            <Rating name="review-rating" value={newRating} style={styles.recipeStandard}
                    onChange={(_, newValue) => setNewRating(newValue)}/>
            <br/>
            <TextField
                style={styles.recipeStandard}
                label="Name"
                variant="outlined"
                value={newName}
                onChange={e => {
                    setNewName(e.target.value);
                    setShowNameError(false);
                }}
                error={showNameError}
                helperText={showNameError ? "Please enter your name." : ""}
            />
            <br/>
            <TextField
                id="outlined-multiline-static"
                label="Leave feedback (optional)"
                multiline
                rows={4}
                style={styles.textField}
                variant="outlined"
                value={newReview}
                onChange={e => setNewReview(e.target.value)}
            />
            <br/><br/>
            <Button style={styles.recipeStandard} variant="contained" color="primary" onClick={() => postReview()}>
                Post
            </Button>
            <br/>
            <Divide/>
            {
                reviewerNames.map((name, index) => {
                    return (
                        <Fragment key={index}>
                            <Grid container>
                                <Typography variant="h5" style={styles.recipeStandard}>{name}</Typography>
                                <Rating value={ratings[index]} readOnly/>
                            </Grid>
                            <Typography
                                style={styles.recipeParagraph}>{reviews[index]}</Typography>
                            <br/>
                        </Fragment>
                    )
                })
            }
        </Route>
    )
}

export default Recipes;
