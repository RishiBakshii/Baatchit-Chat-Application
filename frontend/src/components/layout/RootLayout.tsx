import { Outlet } from "react-router-dom"
import { Navbar } from "../navbar/Navbar"
import { Modal } from "../shared/Modal"
import { GroupChatForm } from "../chat/GroupChatForm"
import { AddFriendForm } from "../friends/AddFriendForm"
import { FriendRequestForm } from "../friends/FriendRequestForm"
import { ProfileForm } from "../user/ProfileForm"
import { selectAddFriendForm, selectAddMemberForm, selectFriendRequestForm, selectGifForm, selectGroupChatForm, selectProfileForm, selectRemoveMemberForm, setAddFriendForm, setAddMemberForm, setFriendRequestForm, setGifForm, setNewgroupChatForm, setProfileForm, setRemoveMemberForm } from "../../services/redux/slices/uiSlice"
import { useAppDispatch, useAppSelector } from "../../services/redux/store/hooks"
import { TenorGifForm } from "../chat/TenorGifForm"
import { AddMemberForm } from "../member/AddMemberForm"
import { RemoveMemberForm } from "../member/RemoveMemberForm"

export const RootLayout = () => {


  const dispatch = useAppDispatch()

  return (
    <>
    <header>
        <Navbar/>
    </header>
    <main className="h-[calc(100vh-3.5rem)]">
        <Outlet/>
    </main>

      <Modal isOpen={useAppSelector(selectGroupChatForm)} onClose={()=>dispatch(setNewgroupChatForm(false))}>
        <GroupChatForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectAddMemberForm)} onClose={()=>dispatch(setAddMemberForm(false))}>
        <AddMemberForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectAddFriendForm)} onClose={()=>dispatch(setAddFriendForm(false))}>
        <AddFriendForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectFriendRequestForm)} onClose={()=>dispatch(setFriendRequestForm(false))}>
        <FriendRequestForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectProfileForm)} onClose={()=>dispatch(setProfileForm(false))}>
        <ProfileForm/>
      </Modal>

      <Modal isOpen={useAppSelector(selectRemoveMemberForm)} onClose={()=>dispatch(setRemoveMemberForm(false))}>
        <RemoveMemberForm/>
      </Modal>
      
      <Modal isOpen={useAppSelector(selectGifForm)} onClose={()=>dispatch(setGifForm(false))}>
        <TenorGifForm/>
      </Modal>
    </>
  )
}
