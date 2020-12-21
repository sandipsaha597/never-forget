import React, { useContext, useState } from "react";
import {
  Button,
  Dimensions,
  LayoutAnimation,
  Linking,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { AppContext, EnumSpacedRepetition } from "../AppContext/AppContext";
import AllNotes from "./AllNotes";
import { add, differenceInSeconds, format } from "date-fns";

const { height } = Dimensions.get("window");

export default function Settings() {
  const [page, setPage] = useState<string>("none");
  const [shared, setShared] = useState("none");
  const [
    rescheduleNotificationsProgress,
    setRescheduleNotificationsProgress,
  ] = useState<any>(false);
  const {
    states: { allNotes, isAnyNoteActive, subs },
    actions: { setKnowSpacedRepetition, setIsAnyNoteActive },
  } = useContext<any>(AppContext);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "Never Forger | Never Forget what you studied using spaced repetition technique",
      });
      if (result.action === Share.sharedAction) {
        console.log("0", result);
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("1.1", result.activityType);
          console.log("1.2", result.action);
        } else {
          // shared
          setTimeout(() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setShared("I shared");
          }, 1000);
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("3 dismissed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 30,
          backgroundColor: "#fff",
        }}
      >
        <Box
          heading='Reschedule Notifications'
          desc='Click here if your phone/tab was rebooted/restarted so you can get notifications to review your notes correctly.'
          highlight
          onPress={(val: string) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            rescheduleNotifications(setRescheduleNotificationsProgress);
            setPage(val);
          }}
        />
        <Box
          heading='Backup'
          desc='Backup your data on google drive or in downloadable CSV or both. So you can switch device and still have your notes and data.'
          comingSoon
        />
        <Box
          heading='Remove Ads'
          desc='Remove ads and have focused and distraction free study sessions.'
          comingSoon
        />
        <Box
          heading='Reminder Time'
          desc='Reminder time of notes are currently fixed at 6:00am. It will be modifiable soon.'
          comingSoon
        />
        <Box
          heading='Recycle Bin'
          desc='Your deleted notes from All Notes will appear here. You can delete them permanently from here.'
          onPress={(val: string) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setPage(val);
          }}
        />
        <Box
          heading='What is Spaced Repetition?'
          onPress={(val: string) =>
            setKnowSpacedRepetition(EnumSpacedRepetition.No)
          }
        />
        <Box
          heading='Share'
          desc="Share if you like our app. Share with 2 people and get 2 months ad free. We won't really track whether you shared our app or not, we'll just trust your words."
          onPress={onShare}
          shared={shared}
          setShared={(val) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setShared(val);
          }}
        />
        <Box
          heading='Contact Us'
          onPress={(val: string) =>
            Linking.openURL("mailto:sandipsaha564@gmail.com")
          }
        />
        <Box
          heading='Privacy Policy'
          onPress={(val: string) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setPage(val);
          }}
        />
        <Box
          heading='Credits'
          onPress={(val: string) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setPage(val);
          }}
        />
      </ScrollView>
      <View
        style={{
          position: "absolute",
          top: page === "none" ? height : 0,
          width: "100%",
          height: height,
          backgroundColor: "#fff",
        }}
      >
        <TouchableNativeFeedback
          style={{
            paddingHorizontal: 15,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            opacity: !!rescheduleNotificationsProgress ? 0.5 : 1,
          }}
          disabled={!!rescheduleNotificationsProgress}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setPage("none");
          }}
        >
          <MaterialIcons name='arrow-back' size={24} color='#000' />
          <Text style={{ paddingLeft: 10 }}>{page}</Text>
        </TouchableNativeFeedback>
        <View style={{ flex: 1, paddingBottom: 80 }}>
          {page === "Recycle Bin" ? (
            <AllNotes recycleBin />
          ) : (
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 160,
              }}
            >
              {page === "Privacy Policy" ? (
                <PrivacyPolicy />
              ) : page === "Credits" ? (
                <>
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}
                  >
                    Developer
                  </Text>
                  <Text>Sandip Saha</Text>
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}
                  >
                    Icons
                  </Text>
                  <Text>Icon made by Vectors Market from www.flaticon.com</Text>
                  <Text>Icon made by Freepik from www.flaticon.com</Text>
                  <Text>Icon made by ultimatearm from www.flaticon.com</Text>
                  <Text>Icon made by Pixelmeetup from www.flaticon.com</Text>
                  <Text>Icon made by Smashicons from www.flaticon.com</Text>
                  <Text>Icon made by Eucalyp from www.flaticon.com</Text>
                </>
              ) : page === "Reschedule Notifications" ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: Dimensions.get("window").height - 160,
                  }}
                >
                  {!!rescheduleNotificationsProgress ? (
                    <>
                      <Text style={{ fontSize: 25, marginBottom: 20 }}>
                        In progress, Please wait...
                      </Text>
                      <Text style={{ fontSize: 20 }}>
                        {rescheduleNotificationsProgress?.index}/
                        {rescheduleNotificationsProgress?.length}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={{ fontSize: 35, color: "green" }}>
                        Done!
                      </Text>
                      <Button
                        title='close'
                        onPress={() => {
                          LayoutAnimation.configureNext(
                            LayoutAnimation.Presets.easeInEaseOut
                          );
                          setPage("none");
                        }}
                      />
                    </>
                  )}
                </View>
              ) : (
                false
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}

const Box = (props: iBox) => {
  const {
    heading,
    desc,
    comingSoon,
    onPress,
    highlight,
    shared,
    setShared,
  } = props;
  return (
    <View
      style={{
        marginBottom: 10,
        backgroundColor: highlight ? "green" : "transparent",
      }}
    >
      <TouchableNativeFeedback
        disabled={comingSoon}
        onPress={() => onPress(heading)}
        style={{
          opacity: comingSoon ? 0.5 : 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: highlight ? "#fff" : "#000" }}>
            {heading}
          </Text>
          {heading === "Reminder Time" && (
            <Text style={{ fontSize: 20 }}>6:00 am</Text>
          )}
        </View>
        {desc && (
          <Text
            style={{
              color: highlight ? "#fff" : "#000",
              paddingBottom: highlight ? 6 : 0,
            }}
          >
            {desc}
          </Text>
        )}
        {comingSoon && <Text style={{ color: "red" }}>coming soon</Text>}
      </TouchableNativeFeedback>
      {heading === "Share" && shared === "I shared" ? (
        <Button
          title='I shared'
          onPress={() => setShared && setShared("I didn't shared")}
        />
      ) : heading === "Share" && shared === "I didn't shared" ? (
        <>
          <Text style={{ paddingHorizontal: 20 }}>
            Thanks for supporting us ❤️ Your gift is active 🎁{" "}
          </Text>
          <Button
            title="I didn't Shared"
            color='red'
            onPress={() => setShared && setShared("none")}
          />
        </>
      ) : (
        false
      )}
    </View>
  );
};

const PrivacyPolicy = () => {
  return (
    <>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Privacy Policy
      </Text>
      <Text>
        Sandip built the Never Forget app as an Ad Supported app. This SERVICE
        is provided by Sandip at no cost and is intended for use as is. This
        page is used to inform visitors regarding my policies with the
        collection, use, and disclosure of Personal Information if anyone
        decided to use my Service. If you choose to use my Service, then you
        agree to the collection and use of information in relation to this
        policy. The Personal Information that I collect is used for providing
        and improving the Service. I will not use or share your information with
        anyone except as described in this Privacy Policy. The terms used in
        this Privacy Policy have the same meanings as in our Terms and
        Conditions, which is accessible at Never Forget unless otherwise defined
        in this Privacy Policy.
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 15,
        }}
      >
        Information Collection and Use
      </Text>
      <Text>
        For a better experience, while using our Service, I may require you to
        provide us with certain personally identifiable information. The
        information that I request will be retained on your device and is not
        collected by me in any way. The app does use third party services that
        may collect information used to identify you. Link to privacy policy of
        third party service providers used by the app *
        [AdMob](https://support.google.com/admob/answer/6128543?hl=en)
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Log Data
      </Text>
      <Text>
        I want to inform you that whenever you use my Service, in a case of an
        error in the app I collect data and information (through third party
        products) on your phone called Log Data. This Log Data may include
        information such as your device Internet Protocol (“IP”) address, device
        name, operating system version, the configuration of the app when
        utilizing my Service, the time and date of your use of the Service, and
        other statistics.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Cookies
      </Text>
      <Text>
        Cookies are files with a small amount of data that are commonly used as
        anonymous unique identifiers. These are sent to your browser from the
        websites that you visit and are stored on your device's internal memory.
        This Service does not use these “cookies” explicitly. However, the app
        may use third party code and libraries that use “cookies” to collect
        information and improve their services. You have the option to either
        accept or refuse these cookies and know when a cookie is being sent to
        your device. If you choose to refuse our cookies, you may not be able to
        use some portions of this Service. **Service Providers** I may employ
        third-party companies and individuals due to the following reasons: * To
        facilitate our Service; * To provide the Service on our behalf; * To
        perform Service-related services; or * To assist us in analyzing how our
        Service is used. I want to inform users of this Service that these third
        parties have access to your Personal Information. The reason is to
        perform the tasks assigned to them on our behalf. However, they are
        obligated not to disclose or use the information for any other purpose.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Security
      </Text>
      <Text>
        I value your trust in providing us your Personal Information, thus we
        are striving to use commercially acceptable means of protecting it. But
        remember that no method of transmission over the internet, or method of
        electronic storage is 100% secure and reliable, and I cannot guarantee
        its absolute security.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Links to Other Sites
      </Text>
      <Text>
        This Service may contain links to other sites. If you click on a
        third-party link, you will be directed to that site. Note that these
        external sites are not operated by me. Therefore, I strongly advise you
        to review the Privacy Policy of these websites. I have no control over
        and assume no responsibility for the content, privacy policies, or
        practices of any third-party sites or services.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Children’s Privacy
      </Text>
      <Text>
        These Services do not address anyone under the age of 13. I do not
        knowingly collect personally identifiable information from children
        under 13. In the case I discover that a child under 13 has provided me
        with personal information, I immediately delete this from our servers.
        If you are a parent or guardian and you are aware that your child has
        provided us with personal information, please contact me so that I will
        be able to do necessary actions.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Changes to This Privacy Policy
      </Text>
      <Text>
        I may update our Privacy Policy from time to time. Thus, you are advised
        to review this page periodically for any changes. I will notify you of
        any changes by posting the new Privacy Policy on this page.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Contact Us
      </Text>
      <Text>
        If you have any questions or suggestions about my Privacy Policy, do not
        hesitate to contact me at sandipsaha564@gmail.com. This privacy policy
        page was created at
        [privacypolicytemplate.net](https://privacypolicytemplate.net) and
        modified/generated by [App Privacy Policy
        Generator](https://app-privacy-policy-generator.nisrulz.com/)
      </Text>
    </>
  );
};

const rescheduleNotifications = (setRescheduleNotificationsProgress: any) => {
  Notifications.getAllScheduledNotificationsAsync().then((allNotifications) => {
    const allNotificationsLength = allNotifications.length;
    allNotifications.forEach((v, i) => {
      const body = v.content.body;
      const revisionDate = () => {
        let dateArray = v.identifier.split("-");
        return new Date(
          parseInt(dateArray[2]),
          parseInt(dateArray[1]) - 1,
          parseInt(dateArray[0])
        );
      };
      const trigger = differenceInSeconds(
        // add(startOfDay(new Date()), { days: 0, hours: 13, minutes: 11 }),
        // add(new Date(note.revisions[0]), { hours: 14, minutes: 18 }),
        add(revisionDate(), { hours: 6 }),
        new Date()
      );
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Review your notes, so you Never Forget them! 📔",
          body: body ?? "Something went wrong",
          data: { data: "goes here" },
        },
        identifier: format(revisionDate(), "dd-MM-yyyy"),
        trigger: { seconds: trigger },
      });

      if (i + 1 >= allNotificationsLength) {
        setRescheduleNotificationsProgress(false);
      } else {
        setRescheduleNotificationsProgress({
          index: i + 1,
          length: allNotificationsLength,
        });
      }
    });
  });
};

// interfaces

interface iBox {
  heading?: string;
  desc?: string;
  comingSoon?: boolean;
  onPress?: any;
  highlight?: boolean;

  shared?: string;
  setShared?: (val: string) => void;
}
