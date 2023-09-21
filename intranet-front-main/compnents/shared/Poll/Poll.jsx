import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import { Toastify } from "@/libs/Toasts";
import styles from "./Poll.module.css";
import { uiActions } from "@/store/ui-slice";
import { postsActions } from "@/store/posts-slice";
import PostsAndCommentsService from "../../../services/PostsAndCommentsService";
import { getDaysLeftFromDate } from "../../../libs/DateAndTime";

export default function Poll({
  create = false,
  postId,
  question,
  options,
  poll_end_date,
  totalVoteCount = 0,
}) {
  const isDateTimeExpired = (dateTimeString) => {
    const givenDateTime = new Date(dateTimeString);
    const currentDateTime = new Date();
    return givenDateTime < currentDateTime;
  };
  const isExpired = isDateTimeExpired(poll_end_date);
  const duration = getDaysLeftFromDate(poll_end_date);
  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.profile.user);
  const { token } = useSelector((state) => state.profile.user.authorisation);
  const { isLoading: isVote, mutate: postVote } = useMutation(
    async (data) => {
      const url = `/posts/${postId}/vote`;
      return await PostsAndCommentsService.Vote(url, token, {
        poll_id: data,
      });
    },
    {
      onSuccess: (res) => {
        // Toastify("success", res.data.message);
      },
      onError: (err) => {
        Toastify("error", err.response?.data.message);
      },
    }
  );
  const { isLoading: isUndoVote, mutate: postUndoVote } = useMutation(
    async (data) => {
      const url = `/posts/${postId}/undo-vote`;
      return await PostsAndCommentsService.Vote(url, token, {
        poll_id: data,
      });
    },
    {
      onSuccess: (res) => {
        // Toastify("success", res.data.message);
      },
      onError: (err) => {
        Toastify("error", err.response?.data.message);
      },
    }
  );

  const checkIfIdExists = (id, data) => {
    return data.find(
      (item) => item.users && item.users.some((user) => user.id === id)
    );
  };
  const handleClick = (option) => {
    if (!isExpired) {
      const isOptionSelected = option.users.find((user) => user.id === id);
      const ifIdExists = checkIfIdExists(id, options);
      if (isOptionSelected) {
        postUndoVote(option.id);
      } else if (ifIdExists) {
        postUndoVote(ifIdExists.id);
        postVote(option.id);
      } else {
        postVote(option.id);
      }
    }
  };
  return (
    <section className={`${styles.pollWrapper} ${!create ? "mx-0" : ""} mb-3`}>
      <div className="d-flex justify-content-between">
        <p className="m-0">{question}</p>
        {create && (
          <div>
            <button
              className="me-2"
              onClick={() =>
                dispatch(
                  uiActions.openPopups({
                    popupType: "sub",
                    content: "create-poll",
                  })
                )
              }
            >
              <i className="far fa-edit"></i>
            </button>
            <button
              onClick={() => {
                dispatch(
                  postsActions.addPostPoll({
                    postPoll: {
                      question: "",
                      options: [{ option: "" }, { option: "" }],
                      duration: "1 day",
                    },
                  })
                );
                dispatch(
                  uiActions.openPopups({
                    popupType: "main",
                    content: "insert-media",
                  })
                );
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
      </div>
      <ul>
        {options.map((option, index) => {
          return (
            /* For Poll Posted */
            create ? (
              <li key={index}>{option.option}</li>
            ) : (
              <li
                role="button"
                key={index}
                onClick={() => handleClick(option)}
                className={`${isExpired ? "disabled" : ""}`}
                style={{
                  backgroundSize: `${
                    (isNaN(option.votes / totalVoteCount)
                      ? 0
                      : option.votes / totalVoteCount) * 100
                  }%`,
                }}
              >
                <span
                  style={{
                    mixBlendMode: `${
                      (totalVoteCount === 0
                        ? 0
                        : option.votes / totalVoteCount) *
                        100 >
                      0.2
                        ? "difference"
                        : ""
                    }`,
                  }}
                >
                  {option.poll}
                  <span className="float-end">
                    {totalVoteCount === 0
                      ? 0
                      : (option.votes / totalVoteCount) * 100}
                    %
                  </span>
                </span>
              </li>
            )
          );
        })}
      </ul>
      {create ? (
        <p className="m-0 text-end">{poll_end_date}</p>
      ) : (
        <p className="m-0 text-start">
          {totalVoteCount} Vote . {duration}
        </p>
      )}
    </section>
  );
}
