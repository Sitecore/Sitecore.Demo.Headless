using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Serialization;
using Sitecore.LayoutService.Serialization.FieldSerializers;
using Sitecore.LayoutService.Serialization.ItemSerializers;
using Sitecore.LayoutService.Serialization.Pipelines.GetFieldSerializer;
using Sitecore.Links;

namespace Sitecore.Demo.Fitness.Feature.Personalization.Serializers
{
    public class EventItemSerializer : IItemSerializer
    {
        protected readonly IGetFieldSerializerPipeline GetFieldSerializerPipeline;

        public EventItemSerializer([NotNull]IGetFieldSerializerPipeline getFieldSerializerPipeline)
        {
            GetFieldSerializerPipeline = getFieldSerializerPipeline;
        }

        public virtual string Serialize([NotNull]Item item)
        {
            using (StringWriter stringWriter = new StringWriter())
            {
                using (JsonTextWriter writer = new JsonTextWriter(stringWriter))
                {
                    writer.WriteStartObject();
                    writer.WritePropertyName("id");
                    writer.WriteValue(item.ID.ToString());

                    writer.WritePropertyName("url");
                    writer.WriteValue(LinkManager.GetItemUrl(item));

                    writer.WritePropertyName("fields");
                    writer.WriteStartObject();

                    foreach (Field itemField in this.GetItemFields(item))
                    {
                        SerializeField(itemField, writer);
                    }

                    writer.WriteEndObject();
                    writer.WriteEndObject();
                }
                return stringWriter.ToString();
            }
        }

        public string Serialize([NotNull]Item item, SerializationOptions options)
        {
            return Serialize(item);
        }

        protected bool FieldFilter(Field field)
        {
            Assert.ArgumentNotNull(field, nameof(field));
            return !field.Name.StartsWith("__", StringComparison.Ordinal);
        }

        protected virtual IEnumerable<Field> GetItemFields(Item item)
        {
            return item.Fields.Where(FieldFilter);
        }

        protected virtual void SerializeField(Field field, JsonTextWriter writer)
        {
            IFieldSerializer fieldSerializer = this.GetFieldSerializer(field);
            fieldSerializer.EnableRenderedValues = Context.PageMode.IsExperienceEditorEditing;
            fieldSerializer.Serialize(field, writer);
        }

        protected virtual IFieldSerializer GetFieldSerializer(Field field)
        {
            IFieldSerializer result = GetFieldSerializerPipeline.GetResult(new GetFieldSerializerPipelineArgs()
            {
                Field = field,
                ItemSerializer = this
            });
            Assert.IsNotNull(result, "fieldSerializer != null");
            return result;
        }
    }
}
