import { useDispatch } from 'react-redux';
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useSelector } from "react-redux";
import { setIsSearch } from '../../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import toast from 'react-hot-toast';
import { useAsyncMutation } from '../../hooks/hook';


const Search = () => {

  const { isSearch } = useSelector((state) => state.misc);

  const [searchUser] = useLazySearchUserQuery();
  // const [sendFriendRequest] = useSendFriendRequestMutation();
  const [sendFriendRequest,isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  const search = useInputValidation("");

  const [users,setUser] = useState([]);

  // const addFriendHandler = async (id) => {
  //   console.log(id)
  //   try {
  //     const res = await sendFriendRequest({receiverId : id})
  //     if(res.data){
  //       toast.success("Freind request sent");
  //       console.log(res.data);
  //     }
  //     else{
  //      toast.error(res?.error?.data?.message || "Something went wrong" )
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something one wrong");
      
  //   }
  // };  
  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { receiverId: id });
  };
  
  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUser(data.users))
        .catch((e) => console.log(e));
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);



  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
     <List>
     {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
              
            />
          ))}
     </List>


      </Stack>
    </Dialog>
  );
};

export default Search;
