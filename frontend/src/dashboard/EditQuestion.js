import TextField from '@mui/material/TextField';
import Title from './Title';

const EditQuestion = () => {
    return (
        <div>
            <Title>Edit Question</Title>
            <TextField fullWidth label={'Title'} id="Title" margin="normal" />
            <TextField fullWidth label={'Categories'} id="Categories" margin="normal" />
            <div>Complexity: EASY</div>
            <div>Description: Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.</div>
        </div>
    )
};

export default EditQuestion;