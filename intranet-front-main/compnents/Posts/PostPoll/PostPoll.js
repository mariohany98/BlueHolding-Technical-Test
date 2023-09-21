import { useSelector } from 'react-redux';
import Poll from '@/compnents/shared/Poll/Poll';

export default function PostPoll() {
    const {question, options, duration} = useSelector(state => state.posts.postPoll);
    return (
        <Poll create={true} question={question} options={options} poll_end_date={duration} />
    )
}