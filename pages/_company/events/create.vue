<template>
  <CreateEvent :create-url="`/api/groups/${$route.params.company}/events`" />
</template>
<script>
export default {
  auth: false
}
</script>
