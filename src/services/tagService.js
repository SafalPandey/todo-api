import Tag from "../models/tag"

export function handleTags(bodyTag){
 return new Tag({
     tag: bodyTag
   }).fetch().then((tag) => {
     if (!tag) {
      return new Tag({
         tag: bodyTag
       }).save().then((createdTag) => createdTag.refresh());
     }else {

       return tag.refresh()
     }
   }).then((tag) => {
     return tag
   })
};
